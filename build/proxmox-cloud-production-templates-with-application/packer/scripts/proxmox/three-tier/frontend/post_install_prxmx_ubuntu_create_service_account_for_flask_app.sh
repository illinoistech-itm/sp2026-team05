#!/bin/bash 
set -e
set -v

# https://copilot.microsoft.com/shares/Pxz7LVbyQtyLZ4on86zkM

echo "Create system account and group nextjsuser ..."
# Using Ubuntu 22.04 this syntax creates a home directory by default: 
# /home/flaskuser
#sudo adduser --system --group flaskuser
# Using Ubuntu 24.04 default behavior changed to not create a home directory
# for a system account
# sudo adduser --system --home /home/flaskuser --group flaskuser
# for javascript user 
sudo mkdir -p /home/nextjsuser
sudo adduser --system --home /home/nextjsuser --group nextjsuser