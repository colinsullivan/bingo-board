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
    # If this marker was the last to be called (on the board)
    last_called = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        
        # If we are enabling this marker, and it is not already enabled
        if(self.value and not(self.last_called)):

            # Make previously called marker on this board NOT the last_enabled
            previously_called = Marker.objects.filter(last_called = True, board = self.board).exclude(pk = self.id)
            
            # If the previously called has not already been changed
            if(len(previously_called)):           
                previously_called = previously_called[0] 
                # Make sure previously called is no longer the last called
                previously_called.last_called = False
                previously_called.save()
            
            # We are now the last called marker
            self.last_called = True
            
        super(Marker, self).save(*args, **kwargs)
