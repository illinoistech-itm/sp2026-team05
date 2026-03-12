#!/bin/bash 
set -e
set -v

# https://copilot.microsoft.com/shares/nis5fbJZkaup7K34PRKwK

sudo mv /home/vagrant/sp2026-team05/code/python-flask/app.py /home/nextjsuser/app.py
sudo mv /home/vagrant/sp2026-team05/code/python-flask/.env /home/nextjsuser/.env
sudo mv /home/vagrant/sp2026-team05/code/python-flask/static/ /home/nextjsuser/static/
sudo mv /home/vagrant/sp2026-team05/code/python-flask/templates/ /home/nextjsuser/templates/

# How to use an ENV variable in a sed command
# https://askubuntu.com/questions/76808/how-do-i-use-variables-in-a-sed-command
# sed -i "s/REPLACE/$APPVAULT_TOKEN/g" /home/nextjsuser/.env
sudo chown -R nextjsuser:nextjsuser /home/nextjsuser/*

# Move the service file into /etc/systemd/system which is where user created
# service files are placed by convention
# Enable Flask App service to boot at start 
# from /etc/systemd/system/flask-app.service
# sudo mv /home/vagrant/team-00/code/python-flask/flask-app.service /etc/systemd/system/flask-app.service
# sudo systemctl enable flask-app.service