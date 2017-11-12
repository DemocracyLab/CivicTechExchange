# CivicTechExchange

Linux setup:

# install postgress and venv
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo apt-get install python3-venv

# checkout the repo
git clone https://github.com/DemocracyLab/CivicTechExchange.git

# create and activate venv
cd CivicTechExchange/
python -m venv myenv
source myvenv/bin/activate

# install python libraries
pip install --upgrade pip
pip install django
pip install dj_database_url
pip install djangorestframework
pip install taggit
pip install django-taggit
pip install whitenoise
pip install psycopg2
pip install boto3

# create database via django and start test server
python manage.py migrate
python manage.py createsuperuser --username dev-admin --email <your email>
python manage.py runserver
