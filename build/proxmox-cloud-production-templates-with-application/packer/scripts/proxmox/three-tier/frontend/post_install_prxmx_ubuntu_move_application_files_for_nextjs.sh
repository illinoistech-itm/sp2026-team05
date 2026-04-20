#!/bin/bash
set -e
set -x


# Change directory to the location of your Next project code
cd /home/vagrant/nextjs-project/

# Run NPM install to download all dependencies from the package.json
# We don't want to be pushing node_module directory around!
sudo -u vagrant npm install
sudo -u vagrant npm run build

sudo -u vagrant pm2 start npm --name "nextjs-project" -- run start

#saves pm2 process list
sudo -u vagrant pm2 save
#sudo pm2 startup systemd -u vagrant --hp /home/vagrant

# This creates your javascript application service file
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
echo "copy the pm2 startup script to the systemd directory"