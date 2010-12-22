from tastypie.resources import ModelResource
from tastypie import fields


from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.authentication import BasicAuthentication


from bingo.models import *
from django.contrib.auth.models import User


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
        response = super(MyResource, self).post_list(request, **kwargs)
        response['content_type'] = 'application/json'
        # self.as_dict returns all the objects, we just want one
        response.write(simplejson.dumps(self.as_dict(request)))
        
        return response

class MarkerResource(MyResource):
    number = fields.IntegerField()
    value = fields.BooleanField(default=False)
    board = fields.ForeignKey('BoardResource', 'board')
    
    
    class Meta:
        queryset = Marker.objects.all()
        
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
        


###
#   Retrieves/modifies all boards on the UI
###
class BoardResource(MyResource):
    
    markers = fields.OneToManyField(MarkerResource, 'marker_set')
    
    class Meta:
        queryset = Board.objects.all()
                
        authentication = BasicAuthentication()
        authorization = DjangoAuthorization()
        
    
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
            
        return object_list
        
    ###
    #   When creating a new board, pass user in.
    ###
    def obj_create(self, bundle, request, **kwargs):
        kwargs['user'] = request.user
        
        # Create
        bundle = super(BoardResource, self).obj_create(bundle, request, **kwargs)
        
        return bundle
        
        
    