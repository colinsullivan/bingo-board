# Initialize App Engine and import the default settings (DB backend, etc.).
# If you want to use a different backend you have to remove all occurences
# of "djangoappengine" from this file.

import os, sys

from djangoappengine.settings_base import *

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

#sys.path.insert(0, os.path.join(BASE_DIR, '..'))


SECRET_KEY = '673trgfajdhsfj;djsfahfDFSLJHKFHhjl'

INSTALLED_APPS = (
    'djangoappengine',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'djangotoolbox',
    'gaeunit',
    'tastypie',
    'bingo',
    'bingo.templatetags',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware'
)

# This test runner captures stdout and associates tracebacks with their
# corresponding output. Helps a lot with print-debugging.
TEST_RUNNER = 'djangotoolbox.test.CapturingTestSuiteRunner'

DEBUG = True

STATIC_DOC_ROOT = os.path.join(BASE_DIR, 'static')

TEMPLATE_DIRS = (os.path.join(BASE_DIR, 'templates'),)

ROOT_URLCONF = 'urls'
APPEND_SLASH = True

LOGIN_REDIRECT_URL = '/home/'
LOGIN_URL = '/login/'
LOGOUT_URL = '/logout/'

#TASTYPIE_DATETIME_FORMATTING = 'rfc-2822'

SITE_ID = 1

# Activate django-dbindexer if available
try:
    import dbindexer
    DATABASES['native'] = DATABASES['default']
    DATABASES['default'] = {'ENGINE': 'dbindexer', 'TARGET': 'native'}
    INSTALLED_APPS += ('dbindexer',)
except ImportError:
    pass
