# Initialize App Engine and import the default settings (DB backend, etc.).
# If you want to use a different backend you have to remove all occurences
# of "djangoappengine" from this file.
from lib.vendor.djangoappengine.settings_base import *

import os

SECRET_KEY = '673trgfajdhsfj;djsfahfDFSLJHKFHhjl'

INSTALLED_APPS = (
    'lib.vendor.djangoappengine',
#    'django.contrib.admin',
#    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'lib.vendor.djangotoolbox',
)

# This test runner captures stdout and associates tracebacks with their
# corresponding output. Helps a lot with print-debugging.
TEST_RUNNER = 'lib.vendor.djangotoolbox.test.CapturingTestSuiteRunner'


STATIC_DOC_ROOT = os.path.join(os.path.dirname(__file__), 'static')

TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), 'templates'),)

ROOT_URLCONF = 'urls'

SITE_ID = 1

# Activate django-dbindexer if available
try:
    import lib.vendor.dbindexer
    DATABASES['native'] = DATABASES['default']
    DATABASES['default'] = {'ENGINE': 'lib.vendor.dbindexer', 'TARGET': 'native'}
    INSTALLED_APPS += ('lib.vendor.dbindexer',)
except ImportError:
    pass
