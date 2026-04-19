#!/bin/bash

# Install and prepare backend database
echo "############ Installing Maria DB Server #####################"
sudo apt update
sudo apt install -y mariadb-server
echo "############ Install of Maria DB Server Complete #####################"
# Required to have the mariadb.service start at boot time
sudo systemctl enable mariadb.service
sudo systemctl start mariadb.service
# Add after mariadb setup:
sudo systemctl stop nftables
sudo systemctl disable nftables

sudo sed -i 's/bind-address.*=.*/bind-address = 0.0.0.0/' /etc/mysql/mariadb.conf.d/50-server.cnf
sudo systemctl restart mariadb
## During the Terraform apply phase -- we will make some run time adjustments
# to configure the database to listen on the meta-network interface only