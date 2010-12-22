from tastypie.resources import ModelResource
from bingo.models import *
from django.contrib.auth.models import User

class BoardResource(ModelResource):
    class Meta:
        queryset = Board.objects.all()