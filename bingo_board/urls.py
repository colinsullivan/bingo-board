from django.conf.urls.defaults import *
from django.conf import settings
from django.contrib import admin

handler500 = 'djangotoolbox.errorviews.server_error'

admin.autodiscover()

urlpatterns = patterns('',
    (r'', include('bingo.urls')),
    (r'^admin/', include(admin.site.urls)),
    
    ###
    #   user login/logout/register
    ###
    (r'^logout/$', 'django.contrib.auth.views.logout_then_login'),
    
    
    
    # Static files (Seems to need to be uncommented for my development server)
#    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
#            {'document_root': settings.STATIC_DOC_ROOT}),
            
    # gaeunit unit test framework
#    (r'test/run', 'django_json_test_runner'),
#    (r'test.*', 'django_test_runner'),
    
    
)
