web: gunicorn portal.wsgi
release: python manage.py migrate --noinput && python manage.py collectstatic --noinput --clear