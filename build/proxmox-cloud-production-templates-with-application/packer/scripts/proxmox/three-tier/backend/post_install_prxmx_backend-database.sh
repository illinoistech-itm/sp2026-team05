#!/bin/bash

# Install and prepare backend database
echo "############ Installing My SQL Server #####################"
# Add MySQL GPG key
wget https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo apt-key add RPM-GPG-KEY-mysql-2022

# Add repo manually (example for Ubuntu 22.04)
echo "deb http://repo.mysql.com/apt/ubuntu/ jammy mysql-8.0" | sudo tee /etc/apt/sources.list.d/mysql.list

# Install
sudo apt update
sudo apt install -y mysql-server
echo "############ Install of MySQL Server Complete #####################"
# Required to have the mysql.service start at boot time
dpkg -l | grep -i mysql
dpkg -l | grep -i maria
systemctl list-unit-files | grep -E 'mysql|maria'
sudo systemctl enable mysql.service
sudo systemctl start mysql.service
sudo systemctl status mysql.service
## Below uncomment for a testing
# sudo mysql_secure_installation
## During the Terraform apply phase -- we will make some run time adjustments
# to configure the database to listen on the meta-network interface only
