#!/bin/bash

# Change directory to the location of your Next project code
cd /home/vagrant/sp2026-team05/code/nextjs-project/

# Run NPM install to download all dependencies from the package.json
# We don't want to be pushing node_module directory around!
npm install --production
npm audit fix
npm install next-auth@beta

# Use the command: npm run build :to compile the source code
npm run build
