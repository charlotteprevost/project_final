import django_heroku
import os

import importlib.util
spec = importlib.util.spec_from_file_location("secrets", "./secrets.py")
secrets = importlib.util.module_from_spec(spec)
spec.loader.exec_module(secrets)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = secrets.SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['show-down.herokuapp.com/', '127.0.0.1:8000']

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = [
    'show-down.herokuapp.com',
    '127.0.0.1:3000',
    'localhost:3000',
]

CSRF_TRUSTED_ORIGINS = [
    'show-down.herokuapp.com',
    '127.0.0.1:3000',
    'localhost:3000',
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'showdown_app',
    # 'webpack_loader',
]

MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'showdown_django.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'build'),
            # os.path.join(BASE_DIR, 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'showdown_django.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'showdown',
        'USER': 'showdownuser',
        'PASSWORD': secrets.DATABASE_PASSWORD,
        # 'HOST': '127.0.0.1',
        # 'HOST': 'https://show-down.herokuapp.com/backend',
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'

STATICFILES_DIRS = [
  os.path.join(BASE_DIR, 'build/static'),
]
  # os.path.join(BASE_DIR, 'assets'),

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'


# STATIC_ROOT = os.path.join(BASE_DIR, '/build/static')
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# STATIC_TMP = os.path.join(BASE_DIR, 'build/static')
# os.makedirs(STATIC_TMP, exist_ok=True)
# os.makedirs(STATIC_ROOT, exist_ok=True)



django_heroku.settings(locals())