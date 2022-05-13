# use python 3 image
FROM python:3

# create a work directory
WORKDIR /crawler

RUN sudo apt-get install libopenmpi-dev

# setup requirement for backend
COPY ./requirements.txt .

RUN pip install -r requirements.txt

# copy all source file for backend
COPY . .

# run cmd
CMD [ "python", "main.py" ]