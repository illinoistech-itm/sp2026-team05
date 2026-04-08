#!/bin/bash

# Use NPM package manager to install needed dependencies to run our Next JS app
# PM2.io is a process manager for javascript applications
cd /home/vagrant/nextjs-project/
mv .env_template .env || true
