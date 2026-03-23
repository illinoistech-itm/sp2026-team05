#!/bin/bash

# https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
# https://ethitter.com/2016/05/generating-a-csr-with-san-at-the-command-line/
set -e
set -v

# Create user first
sudo adduser --system --home /home/nextjsuser --group --shell /bin/bash nextjsuser

# Ensure directory exists
sudo mkdir -p /home/nextjsuser
sudo openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /home/nextjsuser/signed.key -out /home/nextjsuser/signed.crt -subj "/C=US/ST=IL/L=Chicago/O=IIT/OU=itm/CN=iit.edu"
#installs nginx
sudo apt update
sudo apt-get install -y nginx
sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# Change ownership of generated keys so that the user: flaskapp can access them
# creates repo
sudo adduser --system --home /home/nextjsuser --group --shell /bin/bash nextjsuser
sudo chown nextjsuser:nextjsuser /home/nextjsuser/signed.key
sudo chown nextjsuser:nextjsuser /home/nextjsuser/signed.crt