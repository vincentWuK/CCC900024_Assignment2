# use python 3 image
FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

RUN apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip

RUN apt-get --yes -qq update \
 && apt-get --yes -qq upgrade \
 && apt-get --yes -qq install \
                      bzip2 \
                      cmake \
                      cpio \
                      curl \
                      g++ \
                      gcc \
                      gfortran \
                      git \
                      gosu \
                      libblas-dev \
                      liblapack-dev \
                      libopenmpi-dev \
                      openmpi-bin \
                      python3-dev \
                      python3-pip \
                      virtualenv \
                      wget \
                      zlib1g-dev \
                      vim       \
                      htop      \
 && apt-get --yes -qq clean \
 && rm -rf /var/lib/apt/lists/*

# RUN yes | apt install mpich
# create a work directory
WORKDIR /crawler

# setup requirement for backend
COPY ./requirements.txt .

RUN pip install -r requirements.txt

RUN python3 -m textblob.download_corpora

# copy all source file for backend
COPY . .

RUN mpiexec --version
RUN mpirun --version

RUN chmod u+x ./run.sh
# run cmd
CMD ["./run.sh"]