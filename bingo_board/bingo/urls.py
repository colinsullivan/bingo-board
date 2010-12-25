from django.conf.urls.defaults import *
from tastypie.api import Api
from bingo.api import *

api1 = Api(api_name='1')
api1.register(BoardResource())
api1.register(MarkerResource())

urlpatterns = patterns('bingo.views',
    (r'^$', 'index'),
    (r'^home/$', 'home'),
    (r'^register/$', 'register'),
    (r'^login/$', 'login'),
    (r'^view/(?P<board_id>\d+)/$', 'view_board'),
    (r'^edit/(?P<board_id>\d+)/$', 'edit_board'),
    (r'^api/', include(api1.urls)),
)
