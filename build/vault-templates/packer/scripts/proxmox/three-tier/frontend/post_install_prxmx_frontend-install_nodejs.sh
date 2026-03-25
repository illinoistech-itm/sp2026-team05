#!/bin/bash
set -e
set -x
# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Steps to add NodeJS repository to your Ubuntu Server for Node and NPM installation
# Remove and or replace with your required webserver stack
# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

# Change directory to the location of your JS code
cd /home/vagrant/sp2026-team05/code/nextjs-project/
mv .env_template .env

# install project dependencies
sudo -u vagrant npm install
sudo -u vagrant npm audit fix
sudo -u vagrant npm install next-auth@beta

# build nextjs production build
sudo -u vagrant npm run build

# Not sure yet but might need to run nmp run dev here 
#

# Use NPM package manager to install needed dependencies to run our EJS app
# https://github.com/motdotla/dotenv -- create a .env file to pass environment variables
# dotenv mysql2 packages will be installed in the package.json file
# sudo npm install -g express ejs pm2
sudo npm install -g pm2

# pm2.io is an application service manager for Javascript applications
# Using pm2 start the express js application as the user vagrant
sudo -u vagrant pm2 start npm --name "nextjs-project" -- start

# This creates your javascript application service file
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
#sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u vagrant --hp /home/vagrant

# This saves which files we have already started -- so pm2 will
# restart them at boot
sudo -u vagrant pm2 save