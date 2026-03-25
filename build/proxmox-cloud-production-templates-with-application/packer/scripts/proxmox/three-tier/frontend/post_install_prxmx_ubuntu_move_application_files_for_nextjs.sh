#!/bin/bash

# Change directory to the location of your Next project code
cd /home/vagrant/sp2026-team05/code/nextjs-project/
mv .env_template .env || true

sudo chown -R nextjsuser:nextjsuser /home/nextjsuser

# Run NPM install to download all dependencies from the package.json
# We don't want to be pushing node_module directory around!
npm install
#npm audit fix || true

# Use the command: npm run build :to compile the source code
npm run build

# pm2.io is an application service manager for Javascript applications
# Using pm2 start the express js application as the user vagrant
#sudo -u vagrant bash -c "cd /home/vagrant/sp2026-team05/code/nextjs-project && pm2 start server.js"
sudo -u nextjsuser pm2 start npm --name "nextjs-project" -- start

# This creates your javascript application service file
#sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant

# This saves which files we have already started -- so pm2 will 
# restart them at boot
sudo -u vagrant pm2 save