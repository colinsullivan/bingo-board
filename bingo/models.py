

from django.db import models
from django.contrib.auth.models import User

###
#   A bingo board that a user has created.
###
class Board(models.Model):
    user = models.ForeignKey(User)

###
#   A bingo marker that is on a board
###
class Marker(models.Model):
    number = models.IntegerField()
    value = models.BooleanField(default=False)
    board = models.ForeignKey(Board)