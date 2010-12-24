from django.conf.urls.defaults import *
from django.conf import settings

from django.contrib import admin

from tastypie.api import Api
from bingo.api import *

api1 = Api(api_name='1')
api1.register(BoardResource())
api1.register(MarkerResource())


handler500 = 'djangotoolbox.errorviews.server_error'

admin.autodiscover()

urlpatterns = patterns('',
    # Initially, just show index page (where user can login and such)
    (r'^$', 'views.index'),
    
    # After logging in, user will see their home
    (r'^home/$', 'views.home'),
    
    (r'^admin/', include(admin.site.urls)),
    
    ###
    #   user login/logout/register
    ###
    (r'^register/$', 'views.register'),
    (r'^login/$', 'views.login'),
    (r'^logout/$', 'django.contrib.auth.views.logout_then_login'),
    
    # View bingo board
    (r'^view/(?P<board_id>\d+)/$', 'views.view_board'),
    
    
    # Static files
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_DOC_ROOT}),
            
    # gaeunit unit test framework
#    (r'test/run', 'django_json_test_runner'),
#    (r'test.*', 'django_test_runner'),
    (r'^test/', include('gaeunit.urls')),
    
    # REST
    (r'^api/', include(api1.urls)),
    
)
