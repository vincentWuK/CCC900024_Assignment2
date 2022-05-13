#!/bin/bash
pip install -U textblob
python3 -m textblob.download_corpora
sudo apt install mpich
pip install -r requirements.txt
