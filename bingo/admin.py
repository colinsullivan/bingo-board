from django.contrib import admin

from bingo.models import Board, Marker
from django.contrib.auth.models import User

admin.site.register(Board)
admin.site.register(Marker)

