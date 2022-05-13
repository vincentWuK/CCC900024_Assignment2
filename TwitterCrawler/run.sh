#!/bin/bash
exec mpirun -np 2 --allow-run-as-root python3 main.py -c "conf.json"