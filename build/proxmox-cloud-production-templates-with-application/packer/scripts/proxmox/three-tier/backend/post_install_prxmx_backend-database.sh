#!/bin/bash

# Install and prepare backend database
echo "############ Installing My SQL Server #####################"
sudo apt update
sudo apt install mysql-server-8.0
echo "############ Install of MySQL Server Complete #####################"
# Required to have the mysql.service start at boot time
sudo systemctl enable mysql.service
sudo systemctl start mysql.service
sudo systemctl status mysql.service
## Below uncomment for a testing
# sudo mysql_secure_installation
## During the Terraform apply phase -- we will make some run time adjustments
# to configure the database to listen on the meta-network interface only
