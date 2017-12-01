web: gunicorn democracylab.wsgi
release: yarn install && webpack --config webpack.config.js && python manage.py collectstatic --noinput --clear