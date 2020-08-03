#!/bin/bash
export PATH="$PATH:/home/ec2-user/.nvm/versions/node/v12.18.3/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/ec2-user/.local/bin:/home/ec2-user/bin"

echo Installing the dependencies
cd /home/ec2-user/url-shortener/
~/.nvm/versions/node/v12.18.3/bin/npm install

echo Starting the app
~/.nvm/versions/node/v12.18.3/bin/pm2 start /home/ec2-user/url-shortener/ecosystem.config.js

echo Testing the pm2
pm2 -v
