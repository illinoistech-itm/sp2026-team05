#!/bin/bash
set -e
set -x

# Change directory to the location of your Next project code
cd /home/vagrant/sp2026-team05/code/nextjs-project/
mv .env_template .env || true

sudo chown -R nextjsuser:nextjsuser /home/nextjsuser

# Run NPM install to download all dependencies from the package.json
# We don't want to be pushing node_module directory around!
sudo -u nextjsuser  bash << EOF 
cd /home/vagrant/sp2026-team05/code/nextjs-project/
npm install
npm run build

# Start the app with PM2 if not already running
if ! pm2 list | grep -q "nextjs-project"; then
    pm2 start npm --name "nextjs-project" -- start
fi

pm2 save 
EOF

# This creates your javascript application service file
#sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $APP_USER --hp /home/$APP_USER