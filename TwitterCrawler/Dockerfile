# use python 3 image
FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip

RUN yes | apt-get install libopenmpi-dev
RUN yes | apt install openmpi-bin
RUN yes | apt install mpich
# create a work directory
WORKDIR /crawler

# setup requirement for backend
COPY ./requirements.txt .

RUN pip install -r requirements.txt

RUN python3 -m textblob.download_corpora

# copy all source file for backend
COPY . .

# run cmd
CMD [ "mpirun", "-np", "2", "python3", "main.py", "-c", '"conf.json"' ]