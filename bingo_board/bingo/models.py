from django.db import models
from django.contrib.auth.models import User

from djangotoolbox.fields import ListField, BlobField

from django.core.exceptions import ObjectDoesNotExist


from django.db.models.signals import pre_save


###
#   A bingo board that a user has created.
###
class Board(models.Model):
    # The user that created this board
    user = models.ForeignKey(User)
    # The name that the user gives this board.  Can be anything, but must not be 
    # blank.
    name = models.CharField(max_length = 128)
    # The serialized list of makers and their states.  This is updated whenever
    #   any of the markers is changed, and acts as a cache for the list of markers.
    #   This is deserialized then reserialized each time it is used, which may seem
    #   inefficient, but is nowhere near as inefficient as retrieving all of
    #   the associated Marker objects each time.
    markers_serialized = models.TextField()
    
    ###
    #   When board is created, we will create all of our marker objects.
    ###
    def save(self, *args, **kwargs):
        
        isNew = False
        
        if not self.pk:
            isNew = True
        ###
        #   Pre-save
        ###
                
        
        #   Django save method
        super(Board, self).save(*args, **kwargs)
        
        ###
        #   Post-save
        ###
        # If this board is being created initially
        if isNew:
            # Create markers
            for i in range(1,76):
                marker = Marker.objects.create(number=i, board=self)
                
            from bingo.api import *
            # Serialize all markers for this board
            r = BoardMarkerResource()
            r.set_board(self)
                
            # Save markers in serialized form
            self.markers_serialized = r.serialize(None, r.as_dict(), 'application/json')
            self.save()
                
    ###
    #   Delete all markers when board is deleted.
    ###
    def delete(self, using=None):
        
        ## Before deleting board, delete all markers
        Marker.objects.filter(board = self).delete()
        
        return super(Board, self).delete(using)
                
    

###
#   A bingo marker that is on a board.
###
class Marker(models.Model):
    # The number for this marker.  This can be from 1 - 75.  The letter (i.e. B)
    # for this marker is implied based on the number.
    MARKER_CHOICES = [(i, i) for i in range(1,76)]
    number = models.IntegerField(choices=MARKER_CHOICES)
    # If the marker has been called or not
    value = models.BooleanField(default=False)
    # The bingo board we are a member of
    board = models.ForeignKey(Board)
    # When the marker was last updated
    updated_at = models.DateTimeField(auto_now = True)
    
    ###
    #   When marker is updated, make sure that corresponding value in board cache
    #   is updated.
    ###
    def save(self, *args, **kwargs):
        isNew = False
        if not self.pk:
            isNew = True
            
        if not isNew:
            from bingo.api import *
            # Serialize self
            r = SingleMarkerResource()
            r.set_marker(self)
            me_as_dict = r.as_dict()[0]

            # Update board cache with new info
            parent_board = self.board
            # Get board cache
            board_cache = simplejson.loads(parent_board.markers_serialized)
            new_board_cache = []
            for board_marker_dict in board_cache:
                board_marker_dict_id = board_marker_dict['id']
                if (board_marker_dict_id == self.id) or (board_marker_dict_id == unicode(self.id)):
                    new_board_cache.append(me_as_dict)
                else:
                    new_board_cache.append(board_marker_dict)
            new_markers_serialized = r.serialize(None, new_board_cache, 'application/json')
            
            parent_board.markers_serialized = new_markers_serialized
            parent_board.save()
        
        return super(Marker, self).save(*args, **kwargs)
        