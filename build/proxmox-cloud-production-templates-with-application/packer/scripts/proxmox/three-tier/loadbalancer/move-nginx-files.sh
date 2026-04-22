#!/bin/bash

## Assuming the cloning of the team repo has taken place
# this will move all the three Nginx configuration files needed
# to allow the load balancing to take place
# Change team00 to your team repo

# This overrides the default nginx conf file enabling loadbalancing and 443 TLS only
sudo cp -v /home/vagrant/sp2026-team05/code/nginx/nginx.conf /etc/nginx/
sudo cp -v /home/vagrant/sp2026-team05/code/nginx/default /etc/nginx/sites-available/
# This connects the TLS certs built in this script with the instances
sudo cp -v /home/vagrant/sp2026-team05/code/nginx/self-signed.conf /etc/nginx/snippets/
sudo cp -v /home/vagrant/sp2026-team05/code/nginx/upstream.conf /etc/nginx/conf.d/

# Make nginx wait for Consul DNS to resolve the frontend nodes before startup.
sudo mkdir -p /etc/systemd/system/nginx.service.d
sudo tee /etc/systemd/system/nginx.service.d/override.conf > /dev/null <<'EOF'
[Unit]
Wants=network-online.target consul.service systemd-resolved.service
After=network-online.target consul.service systemd-resolved.service

[Service]
Restart=on-failure
RestartSec=5s
ExecStartPre=
ExecStartPre=/bin/bash -c 'for host in team05-fe-vm0.service.consul team05-fe-vm1.service.consul team05-fe-vm2.service.consul; do for attempt in {1..30}; do getent ahostsv4 "$host" >/dev/null 2>&1 && break; sleep 2; done; getent ahostsv4 "$host" >/dev/null 2>&1 || exit 1; done'
EOF

sudo systemctl daemon-reload
sudo systemctl enable nginx
