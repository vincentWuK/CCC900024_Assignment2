# use python 3 image
FROM python:3

# create a work directory
WORKDIR /app

# set environment variable
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# setup requirement for backend
COPY ./requirements.txt .

RUN pip install -r requirements.txt

# copy all source file for backend
COPY . .

# run cmd
CMD [ "python", "app.py" ]