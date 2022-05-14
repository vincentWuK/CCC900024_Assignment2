#!/bin/bash

ansible-playbook -i inventory/hosts.ini -u ubuntu --key-file=ccc_a2.pem crawler-git-clone.yaml