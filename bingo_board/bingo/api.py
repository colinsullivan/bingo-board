from tastypie.resources import ModelResource
from tastypie import fields

from tastypie.constants import ALL_WITH_RELATIONS, ALL

from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import Authentication, BasicAuthentication

from django.http import HttpResponse
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.http import *
from tastypie.paginator import Paginator

from tastypie.bundle import Bundle
from tastypie.fields import RelatedField

from django.utils import simplejson


from django.contrib.auth.models import User
from bingo.models import *

from tastypie.cache import NoCache

###
#   The cache use for retrieving markers.  Just looks at the markers_serialized
#   attribute of the board object.  This increases speed dramatically and keeps
#   google app engine quotas in check.
###
class MarkerCache(NoCache):
    
    ###
    #   Helper to get the associated board given the encoded key.
    ###
    def get_board(self, key):
        # The key sent in will be of the form: 1:marker:list:board_id=3039
        # Grab the board_id from it: 
        board_id = int(key.split('board_id=')[1])
        board = Board.objects.get(pk = board_id)
        return board
    
    ###
    #   Get the markers (as a dict)
    ###
    def get(self, key):
        board = self.get_board(key)
        
        return simplejson.loads(board.markers_serialized)
        
    ###
    #   We don't set the cache here, that is taken care of in the model.
    ###
    def set(self, key, value, timeout=60):
        raise NotImplementedError()


class DjangoAuthentication(Authentication):
    """Authenticate based upon Django session"""
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()

###
#   See if the user is the creator of the board.
###
class BoardAuthorization(Authorization):
    def is_authorized(self, request, object=None):

        # GET is always allowed
        if request.method == 'GET':
            return True

        # user must be logged in to check permissions
        # authentication backend must set request.user
        if not hasattr(request, 'user'):
            return False
            
        
        if object:
            return (request.user == object.user)
        else:
            return True
            
###
#   Make sure the user is the creator of the board that this marker belongs to.
###
class MarkerAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        
        # Get is always allowed
        if request.method == 'GET':
            return True
            
        # user must be logged in to check permissions
        # authentication backend must set request.user
        if not hasattr(request, 'user'):
            return False


        if object:
            return (request.user == object.board.user)
        else:
            return True
        

###
#   This is soley to provide the to_dict function.  Once I figure out what a better
#   way to do this is, we can remove this class.
###
class MyResource(ModelResource):
    ###
    #   This method is used to bootstrap the objects into place.
    ###
    def as_dict(self, request=None):
        objs = self.get_object_list(request)

        objsBundles = [self.full_dehydrate(obj=obj) for obj in objs]

        objsSerialized = [obj.data for obj in objsBundles]

        return objsSerialized
        
    ###
    #   This method returns the serialized object upon creation, instead of 
    #   just the uri to it.
    ###
    def post_list(self, request, **kwargs):
       deserialized = self.deserialize(request,
                                       request.raw_post_data,
                                       format=request.META.get('CONTENT_TYPE',
                                                               'application/json'))
       bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized))
       self.is_valid(bundle, request)
       updated_bundle = self.obj_create(bundle, request=request)
       resp = self.create_response(request,
                                   self.full_dehydrate(updated_bundle.obj))
       resp['location'] = self.get_resource_uri(updated_bundle)
       resp.code = 201
       return resp                              


###
#   Retrieves/modifies all boards on the UI
###
class BoardResource(MyResource):
    name = fields.CharField('name')
    
    class Meta:
        queryset = Board.objects.all()
                
        authentication = DjangoAuthentication()
        authorization = BoardAuthorization()
        
    
    ###
    #   Make sure use is allowed to modify this board
    ###
    def apply_authorization_limits(self, request, object_list):
        if request:
            
            user = request.user
        
            method = request.META['REQUEST_METHOD']
        
            # If user is trying to delete or update the collection
            if method == 'DELETE' or method == 'PUT':
                # User must be the creator, so retrieve only the user's boards.
                object_list = super(BoardResource, self).apply_authorization_limits(request, user.board_set.all())
            
            else:
                object_list = super(BoardResource, self).apply_authorization_limits(request, Board.objects.all())
            
            return object_list
        else:
            return super(BoardResource, self).apply_authorization_limits(request, object_list)
        
    ###
    #   When creating a new board, pass user in.
    ###
    def obj_create(self, bundle, request, **kwargs):
        kwargs['user'] = request.user
        
        # Create
        bundle = super(BoardResource, self).obj_create(bundle, request, **kwargs)
        
        return bundle
        
###
#   Retrieves only boards that the current user created
###
class UserBoardResource(BoardResource):
    
    class Meta:
        queryset = Board.objects.all()
                
        authentication = DjangoAuthentication()
        authorization = BoardAuthorization()
        
        allowed_methods = ['get']

    def apply_authorization_limits(self, request, object_list):
        user = request.user
        
        method = request.META['REQUEST_METHOD']
        
        # only get is needed
        object_list = super(BoardResource, self).apply_authorization_limits(request, user.board_set.all())
        
        return object_list
        
###
#   Get a single board (most likely for serialization purposes).
###
class SingleBoardResource(BoardResource):
    
    class Meta:
        queryset = Board.objects.all()

        authentication = DjangoAuthentication()
        authorization = BoardAuthorization()

        allowed_methods = ['get']
        
        # The single board id
        board_id = None
        
    ###
    #   This must be called before the board is to be retrieved.
    ###
    def set_board_id(self, board_id):
        self._meta.board_id = board_id
        
    
    def apply_authorization_limits(self, request, object_list):
        
        board_id = self._meta.board_id
        
        if board_id:
            return super(BoardResource, self).apply_authorization_limits(request, Board.objects.filter(pk = board_id))
            
        else:
            raise Exception('board_id must be set')

###
#   A bingo marker.
###
class MarkerResource(MyResource):
    number = fields.IntegerField('number')
    value = fields.BooleanField('value', default=False)
    board = fields.ForeignKey(BoardResource, 'board')
    updated_at = fields.DateTimeField('updated_at')

    class Meta:
        limit = 75
        queryset = Marker.objects.all()

        filtering = {
            'board': ALL_WITH_RELATIONS, 
        }

        authentication = Authentication()
        authorization = MarkerAuthorization()
        
        cache = MarkerCache()
        
    ###
    #   If we are getting the list of markers, make sure that we check the cache.
    ###
    def obj_get_list(self, request=None, **kwargs):
        """
        A ORM-specific implementation of ``obj_get_list``.

        Takes an optional ``request`` object, whose ``GET`` dictionary can be
        used to narrow the query.
        """
        filters = None

        if hasattr(request, 'GET'):
            filters = request.GET

        applicable_filters = self.build_filters(filters=filters)
        
        # If we are trying to get the markers for a single board, get from cache
        if('board__exact' in applicable_filters):
            kwargs['board_id'] = applicable_filters['board__exact']
            return self.cached_obj_get_list(request, **kwargs)
        else:
            try:
                # Call super here just to avoid any cache checking.  This probably
                # doesn't matter
                # .
                return super(MarkerResource, self).get_object_list(request).filter(**applicable_filters)
            except ValueError, e:
                raise NotFound("Invalid resource lookup data provided (mismatched type).")
            
    ###
    #   The list of markers will be returned as a dictionary which can then be 
    #   sent to create_response for serializing.
    ###
    def get_list(self, request, **kwargs):
        
        # objects is sent directly in to the response because it is a dict
        objects = self.obj_get_list(request=request, **self.remove_api_resource_names(kwargs))

        return self.create_response(request, objects)     
        
    
###
#   A resource for serializing a set of markers given a board.
###
class BoardMarkerResource(MarkerResource):
    
    class Meta:
        limit = 75
        queryset = Marker.objects.all()

        filtering = {
            'board': ALL_WITH_RELATIONS, 
        }

        authentication = Authentication()
        authorization = MarkerAuthorization()
        
        # The board object
        board = None
        
    ###
    #   This must be called before the board is to be retrieved.
    ###
    def set_board(self, board):
        self._meta.board = board

    def apply_authorization_limits(self, request, object_list):

        board = self._meta.board

        if board:
            return super(BoardMarkerResource, self).apply_authorization_limits(request, Marker.objects.filter(board = board))

        else:
            raise Exception('board must be set')

###
#   A resource for a single marker.
###
class SingleMarkerResource(MarkerResource):
    
    class Meta:
        limit = 75
        queryset = Marker.objects.all()

        filtering = {
            'board': ALL_WITH_RELATIONS, 
        }

        authentication = Authentication()
        authorization = MarkerAuthorization()
        
        # The marker object
        marker = None
        
    ###
    #   This must be called before the marker is retrieved
    ###
    def set_marker(self, marker):
        self._meta.marker = marker
    
    def apply_authorization_limits(self, request, object_list):
        marker = self._meta.marker
        
        if marker:
            return super(SingleMarkerResource, self).apply_authorization_limits(request, [marker])
        else:
            raise Exception('marker must be set')
        
