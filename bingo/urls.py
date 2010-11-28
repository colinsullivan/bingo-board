from django.conf.urls.defaults import *
from django.conf import settings

from django.contrib import admin


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
)
