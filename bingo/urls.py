from django.conf.urls.defaults import *
from django.conf import settings


handler500 = 'djangotoolbox.errorviews.server_error'

urlpatterns = patterns('',
    # Initially, just show index page
    ('^$', 'controllers.index.home'),
    
    
    # Static files
    (r'^static/(?P<path>.*)$', 'django.views.static.serve',
            {'document_root': settings.STATIC_DOC_ROOT}),
)
