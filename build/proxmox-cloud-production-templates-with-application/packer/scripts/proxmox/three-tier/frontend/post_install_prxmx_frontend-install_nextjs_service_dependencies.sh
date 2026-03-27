#!/bin/bash

# Use NPM package manager to install needed dependencies to run our Next JS app
# PM2.io is a process manager for javascript applications
# sudo npm install -g --save pm2 # already installed in the nodejs installation script
cd /home/vagrant/sp2026-team05/code/nextjs-project/

#ensures npm binaries are executable 
ls -l /usr/bin/node /usr/bin/npm
sudo chmod +x /usr/bin/node
sudo chmod +x /usr/bin/npm
ls -l /usr/bin/node /usr/bin/npm

# Kill any PM2 processes (very important)
sudo pkill -f PM2 || true
sudo pkill -f pm2 || true

# Remove PM2 runtime files (not just folder existence)
sudo rm -rf /home/nextjsuser/.pm2

# Recreate clean directory
sudo mkdir -p /home/nextjsuser/.pm2
sudo chown -R nextjsuser:nextjsuser /home/nextjsuser/.pm2

# This saves which files we have already started -- so pm2 will 
# restart them at boot
sudo -u nextjsuser pm2 start npm --name "nextjs-project" -- run start

#saves pm2 process list 
sudo -u nextjsuser pm2 save
sudo pm2 startup systemd -u nextjsuser --hp /home/nextjsuser
