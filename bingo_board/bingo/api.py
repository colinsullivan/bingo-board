from tastypie.resources import ModelResource
from tastypie import fields

from tastypie.constants import ALL_WITH_RELATIONS

from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import Authentication, BasicAuthentication

from django.http import HttpResponse
from tastypie.utils import is_valid_jsonp_callback_value, dict_strip_unicode_keys, trailing_slash
from tastypie.http import *

from tastypie.bundle import Bundle
from tastypie.fields import RelatedField

from django.utils import simplejson


from bingo.models import *
from django.contrib.auth.models import User


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
#   This is soley to provide the to_dict function.  Once I figure out what a better
#   way to do this is, we can remove this class.
###
class MyResource(ModelResource):
    ###
    #   This method is used to bootstrap the objects into place.
    ###
    def as_dict(self, request):
        cols = self.get_object_list(request)

        colsBundles = [self.full_dehydrate(obj=obj) for obj in cols]

        colsSerialized = [obj.data for obj in colsBundles]

        return colsSerialized
        
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
        user = request.user
        
        method = request.META['REQUEST_METHOD']
        
        # If user is trying to delete or update the collection
        if method == 'DELETE' or method == 'PUT':
            # User must be the creator, so retrieve only the user's boards.
            object_list = super(BoardResource, self).apply_authorization_limits(request, user.board_set.all())
            
        else:
            object_list = super(BoardResource, self).apply_authorization_limits(request, Board.objects.all())
            
        return object_list
        
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
    last_called = fields.BooleanField('last_called', default=False)


    class Meta:
        limit = 75
        queryset = Marker.objects.all()

        filtering = {
            'board': ALL_WITH_RELATIONS, 
        }

        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
