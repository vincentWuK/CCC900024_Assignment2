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


def gettweetsstream(topic, city, conf, account_num, is_suburb):
    apikey = conf["auth"][str(account_num)]["apikey"]
    apisecret = conf["auth"][str(account_num)]["apisecret"]
    accesstoken = conf["auth"][str(account_num)]["accesstoken"]
    accesssecret = conf["auth"][str(account_num)]["accesssecret"]
    bearer_token = conf["auth"][str(account_num)]["bearer_token"]
    if is_suburb:
        suburbs = conf["suburb"]
        for suburb in suburbs:
            name = suburb + ", " + city
            try:
                bbox = FindBBox(name)
            except BaseException as e:
                print("cannot find bbox: ", e)
            worker = TweetsCrawler(apikey, apisecret, accesstoken,
                                   accesssecret, bearer_token,
                                   conf["keywordsfile"][topic],
                                   [city, suburb, bbox], conf["server"],
                                   conf["database"][topic])
            worker.GetTweetsStream()
        bbox = FindBBox(city)
        new_dbname = conf["database"][topic] + "_nosub"
        worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                               bearer_token, conf["keywordsfile"][topic],
                               [city, "no", bbox], conf["server"],
                               new_dbname)
        worker.GetTweetsStream()
    else:
        bbox = FindBBox(city)
        worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                               bearer_token, conf["keywordsfile"][topic],
                               [city, None, bbox], conf["server"],
                               conf["database"][topic])
        worker.GetTweetsStream()


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
        with ThreadPoolExecutor(max_workers=3) as pool:
            try:
                pool.submit(gettweetsstream, topic1, conf["city"][0], conf, 1,
                            True)
                pool.submit(gettweetsstream, topic2, conf["city"][1], conf, 1,
                            False)
            except BaseException as e:
                print("Error: cannot start threads")
    else:
        with ThreadPoolExecutor(max_workers=2) as pool:
            try:
                pool.submit(gettweetsstream, topic2, conf["city"][2], conf, 2,
                            False)
                pool.submit(gettweetsstream, topic2, conf["city"][3], conf, 2,
                            False)
                pool.submit(gettweetsstream, topic2, conf["city"][0], conf, 2,
                            False)
            except BaseException as e:
                print("Error: cannot start threads")
