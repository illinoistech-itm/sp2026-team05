#!/bin/bash

# Use NPM package manager to install needed dependencies to run our Next JS app
# PM2.io is a process manager for javascript applications
sudo npm install -g pm2

# This saves which files we have already started -- so pm2 will
# restart them at boot
sudo -u vagrant pm2 start npm --name "nextjs-project" -- run start

sudo -u vagrant pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u vagrant --hp /home/vagrant