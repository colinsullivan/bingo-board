from django.db import models
from django.contrib.auth.models import User

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
                
    ###
    #   Delete all markers when board is deleted.
    ###
    def delete(self, using=None):
        
        ## Before deleting board, delete all markers
        Marker.objects.filter(board = self).delete()
        
        super(Board, self).delete(using)
                
    

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
    
    ###
    #   When a marker is saved, we can create a MarkerChangeEvent for it.
    ###
    def save(self, *args, **kwargs):
        
        isNew = False
        
        if not self.pk:
            isNew = True
        
        
        # Parent save
        super(Marker, self).save(*args, **kwargs)
        
        # If this was not a new marker, but instead it was being updated
        if not(isNew):
            # Create call event
            event = MarkerChangeEvent(board=self.board, marker=self).save()
    

###
#   An event object that represents a number being called.
###
class MarkerChangeEvent(models.Model):
    # The board which the event ocurred on
    board = models.ForeignKey(Board)
    # The marker which the event ocurred on
    marker = models.ForeignKey(Marker)
    # The date/time for this event
    time = models.DateTimeField(auto_now_add = True)
    
