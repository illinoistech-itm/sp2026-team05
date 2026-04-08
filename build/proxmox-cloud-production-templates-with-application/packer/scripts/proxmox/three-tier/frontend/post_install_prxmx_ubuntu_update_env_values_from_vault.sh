#!/bin/bash 
set -e
set -v

##############################################################################
# Using Find and Replace via sed to add in the secrets to connect to MySQL
# There is a .env file containing an empty template of secrets -- essentially
# this is a hack to pass environment variables into the vm instances
###############################################################################

sudo sed -i "s|FQDN=|FQDN=$FQDN|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|DBUSER=|DBUSER=$DBUSER|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|DBPASS=|DBPASS=$DBPASS|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|DATABASE=|DATABASE=$DATABASE|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|APP_SECRET=|APP_SECRET=$APP_SECRET|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|AUTH_GOOGLE_ID=|CLIENTID=$CLIENTID|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|AUTH_GOOGLE_SECRET=|CLIENTSECRET=$CLIENTSECRET|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|AUTH_TRUST_HOST=|AUTH_TRUST_HOST=$AUTH_TRUST_HOST|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|AUTH_URL=|AUTH_URL=$AUTH_URL|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|NEXTAUTH_SECRET=|NEXTAUTH_SECRET=$NEXTAUTH_SECRET|" /home/vagrant/nextjs-project/.env
sudo sed -i "s|NEXTAUTH_URL=|NEXTAUTH_URL=$NEXTAUTH_URL|" /home/vagrant/nextjs-project/.env