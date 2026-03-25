#!/bin/bash
set -e
set -x
# Install and prepare frontend web server - Example for ExpressJS/NodeJS

sudo apt-get update
sudo apt-get install -y curl rsync

# Steps to add NodeJS repository to your Ubuntu Server for Node and NPM installation
# Remove and or replace with your required webserver stack
# https://github.com/nodesource/distributions/blob/master/README.md#using-ubuntu-2
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

# Change directory to the location of your JS code
#cd /home/vagrant/sp2026-team05/code/nextjs-project/

# https://github.com/motdotla/dotenv -- create a .env file to pass environment variables
# dotenv mysql2 packages will be installed in the package.json file
sudo npm install -g pm2

