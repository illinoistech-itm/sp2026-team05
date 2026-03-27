#!/bin/bash
set -e
set -x

#copying next js file to next js user and change ownership to nextjsuser
rsync -a --chown=nextjsuser:nextjsuser /home/vagrant/sp2026-team05/code/nextjs-project /home/nextjsuser/
sudo chown -R nextjsuser:nextjsuser /home/nextjsuser/nextjs-project

# Change directory to the location of your Next project code
cd /home/nextjsuser/nextjs-project/
mv .env_template .env || true

# Run NPM install to download all dependencies from the package.json
# We don't want to be pushing node_module directory around!
sudo -u nextjsuser bash << EOF 
cd /home/nextjsuser/nextjs-project/
npm install
npm run build
EOF

sudo -u nextjsuser pm2 start npm --name nextjs-project -- start
sudo -u nextjsuser pm2 save

# This creates your javascript application service file
#sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u vagrant --hp /home/vagrant
#sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u nextjsuser --hp /home/nextjsuser
sudo env PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u nextjsuser --hp /home/nextjsuser