#!/bin/bash
whoami
pwd
echo $PATH
export PATH="$PATH:/home/ec2-user/.nvm/versions/node/v12.18.3/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/ec2-user/.local/bin:/home/ec2-user/bin"
echo $PATH
echo Node.js Version:
~/.nvm/versions/node/v12.18.3/bin/node -v
echo PM2 Version:
~/.nvm/versions/node/v12.18.3/bin/pm2 -v
echo npm Version:
~/.nvm/versions/node/v12.18.3/bin/npm  -v
# cd /home/ec2-user/url-shortener/
# /home/ec2-user/.nvm/versions/node/v12.18.3/bin/npm install
# /home/ec2-user/.nvm/versions/node/v12.18.3/bin/pm2 start /home/ec2-user/url-shortener/ecosystem.config.js
