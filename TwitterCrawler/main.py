from click import confirmation_option
from TweetsCrawler import TweetsCrawler
from concurrent.futures import ThreadPoolExecutor
from FindBBox import FindBBox
import sys
import getopt
import json
import threading
import time
from mpi4py import MPI

comm = MPI.COMM_WORLD  # create mpi
RANK = comm.Get_rank()  # get the current process's rank
SIZE = comm.Get_size()  # get the number of processes


def gettweetsstream(topic, conf, account_num, is_suburb):
    if is_suburb:
        while (True):
            gettweetsuburb(topic, "melbourne", conf, account_num)
    else:
        while (True):
            gettweetcity(topic, conf, account_num)


def gettweetcity(topic, conf, account_num):
    apikey = conf["auth"][str(account_num)]["apikey"]
    apisecret = conf["auth"][str(account_num)]["apisecret"]
    accesstoken = conf["auth"][str(account_num)]["accesstoken"]
    accesssecret = conf["auth"][str(account_num)]["accesssecret"]
    bearer_token = conf["auth"][str(account_num)]["bearer_token"]
    cities = conf["city"]
    for c in cities:
        bbox = FindBBox(c)
        worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                               bearer_token, conf["keywordsfile"][topic],
                               [c, None, bbox], conf["server"],
                               conf["database"][topic])
        worker.GetTweetsStream()
        time.sleep(60 * 5)


def gettweetsuburb(topic, city, conf, account_num):
    apikey = conf["auth"][str(account_num)]["apikey"]
    apisecret = conf["auth"][str(account_num)]["apisecret"]
    accesstoken = conf["auth"][str(account_num)]["accesstoken"]
    accesssecret = conf["auth"][str(account_num)]["accesssecret"]
    bearer_token = conf["auth"][str(account_num)]["bearer_token"]
    suburbs = conf["suburb"]
    for suburb in suburbs:
        name = suburb + ", " + city
        try:
            bbox = FindBBox(name)
        except BaseException as e:
            print("cannot find bbox: ", e)
        worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                               bearer_token, conf["keywordsfile"][topic],
                               [city, suburb, bbox], conf["server"],
                               conf["database"][topic])
        worker.GetTweetsStream()
        time.sleep(60 * 5)


if __name__ == "__main__":
    argv = sys.argv[1:]  # read input args except script's name  sys.argv[]
    opts, args = getopt.getopt(argv, "c:t:p:")
    for opt, arg in opts:
        if opt in ['-c']:
            configfilepath = arg
        elif opt in ['-t']:
            topic1 = arg
        elif opt in ['-p']:
            topic2 = arg
    f = open(configfilepath, 'r')
    conf = json.load(f)  # dict
    if RANK == 0:
        with ThreadPoolExecutor(max_workers=2) as pool:
            try:
                pool.submit(gettweetsstream, topic1, conf, 1, True)
            except BaseException as e:
                print("Error: cannot start threads")
    else:
        with ThreadPoolExecutor(max_workers=2) as pool:
            try:
                pool.submit(gettweetsstream, topic2, conf, 2, False)
            except BaseException as e:
                print("Error: cannot start threads")
