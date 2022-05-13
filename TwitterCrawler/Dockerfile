# use python 3 image
FROM ubuntu:18.04

RUN apt-get update -y
RUN apt-get install -y python-pip python-dev build-essential
RUN apt-get install libopenmpi-dev
# create a work directory
WORKDIR /crawler

# setup requirement for backend
COPY ./requirements.txt .

RUN pip install -r requirements.txt

# copy all source file for backend
COPY . .

# run cmd
CMD [ "python", "main.py" ]