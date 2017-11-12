# CivicTechExchange

Linux setup:

# install Node.js
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs

# install Yarn package manager:
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

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
pip install -r requirements.txt

# build static assets before runserver
npm run build

# create database via django and start test server
python manage.py migrate
python manage.py createsuperuser --username dev-admin --email <your email>
python manage.py runserver
