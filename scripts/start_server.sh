#!/bin/bash
cd /home/ec2-user/url-shortener/
/home/ec2-user//.nvm/versions/node/v12.18.3/bin/npm install
/home/ec2-user/.nvm/versions/node/v12.18.3/bin/pm2 start /home/ec2-user/url-shortener/ecosystem.config.js
