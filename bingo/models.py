from django.db import models
from django.contrib.auth.models import User

from django.db.models.signals import pre_save
from django.dispatch import receiver


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
#   A bingo marker that is on a board.
###
class Marker(models.Model):
    # The number for this marker.  This can be from 1 - 75.  The letter (i.e. B)
    # for this marker is implied based on the number.
    MARKER_CHOICES = [(i, i) for i in range(1,76)]
    number = models.IntegerField(choices=MARKER_CHOICES)
    value = models.BooleanField(default=False)
    board = models.ForeignKey(Board)
    