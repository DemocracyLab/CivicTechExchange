# CivicTechExchange

## Environment Setup

Make sure you are using Python 3. [pyenv](https://github.com/pyenv/pyenv) and [virtualenv](https://virtualenv.pypa.io/en/stable/) might be helpful.

Install libraries: `pip3 install -r requirements.txt`

SQLite is used by default. If you want to use other databases, change the `DATABASES` entry in `democracylab/settings.py` accordingly.

## Run Locally

`python3 manage.py makemigrations`

`python3 manage.py migrate`

`python3 manage.py runserver`
