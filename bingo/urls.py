from django.conf.urls.defaults import *
from django.conf import settings

from django.contrib import admin

from tastypie.api import Api
from bingo.api import *

api1 = Api(api_name='1')
api1.register(BoardResource())


handler500 = 'djangotoolbox.errorviews.server_error'

admin.autodiscover()

urlpatterns = patterns('',
    # Initially, just show index page
    ('^$', 'controllers.index.home'),
    
    (r'^admin/', include(admin.site.urls)),
    
    ###
    #   user login/logout/register
    ###
    ('^register/$', 'controllers.index.register'),
    ('^login/$', 'controllers.index.login'),
    
    
    # Static files
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_DOC_ROOT}),
            
    # gaeunit unit test framework
#    (r'test/run', 'django_json_test_runner'),
#    (r'test.*', 'django_test_runner'),
    (r'^test', include('gaeunit.urls')),
    
    # REST
    (r'^api/', include(api1.urls)),
    
)
