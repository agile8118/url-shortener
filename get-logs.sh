#!/bin/bash

# First run chmod +x get-logs.sh
rm -rf ~/Downloads/url-shortener-logs
mkdir ~/Downloads/url-shortener-logs
scp -r -i ~/.ssh/aws-main.pem ec2-user@ec2-35-153-33-197.compute-1.amazonaws.com:url-shortener/logs ~/Downloads/url-shortener-logs/server-1/
