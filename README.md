# CivicTechExchange

## Environment Setup

Make sure you are using Python 3. [pyenv](https://github.com/pyenv/pyenv) and [virtualenv](https://virtualenv.pypa.io/en/stable/) might be helpful.

Install libraries: `pip install -r requirements.txt`

SQLite is used by default. If you want to use other databases, change the `DATABASES` entry in `civic_marketplace/settings.py` accordingly.

## Run Locally

`python manage.py makemigrations`

`python manage.py migrate`

`python manage.py runserver`
