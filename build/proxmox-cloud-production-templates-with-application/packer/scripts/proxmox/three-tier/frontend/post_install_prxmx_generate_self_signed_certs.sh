#!/bin/bash

# https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
# https://ethitter.com/2016/05/generating-a-csr-with-san-at-the-command-line/
set -e
set -v

# Ensure directory exists
sudo openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /home/vagrant/signed.key -out /home/vagrant/signed.crt -subj "/C=US/ST=IL/L=Chicago/O=IIT/OU=itm/CN=iit.edu"
#installs nginx
sudo apt update
sudo apt-get install -y nginx

sudo openssl dhparam -out /etc/nginx/dhparam.pem 2048

# creates repo
sudo chown vagrant:vagrant /home/vagrant/signed.key /home/vagrant/signed.crt
