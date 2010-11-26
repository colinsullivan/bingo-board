from django.conf.urls.defaults import *


handler500 = 'djangotoolbox.errorviews.server_error'

urlpatterns = patterns('',
    # Initially, just show index page
    ('^$', 'controllers.index.home'),
)
