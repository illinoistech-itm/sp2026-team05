#!/bin/bash

# Use NPM package manager to install needed dependencies to run our Next JS app
# PM2.io is a process manager for javascript applications
# sudo npm install -g --save pm2 # already installed in the nodejs installation script
cd /home/vagrant/sp2026-team05/code/nextjs-project/

# This saves which files we have already started -- so pm2 will 
# restart them at boot
pm2 start npm --name "nextjs-project" -- run start

#ensures node and npm binaries are executable by the nextjsuser and pm2 process manager
sudo chmod +x /usr/bin/node
sudo chmod +x /usr/bin/npm
ls -l /usr/bin/node /usr/bin/npm

#saves pm2 process list 
sudo -u nextjsuser pm2 save
pm2 startup systemd -u nextjsuser --hp /home/nextjsuser
