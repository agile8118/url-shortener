#!/bin/bash

# First run chmod +x get-logs.sh
rm -rf ~/Downloads/weer-logs
mkdir ~/Downloads/weer-logs
scp -r -i ~/.ssh/aws-new.pem joseph@ec2-18-222-232-59.us-east-2.compute.amazonaws.com:weer/logs ~/Downloads/weer-logs/server-1/
