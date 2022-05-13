from click import confirmation_option
from TweetsCrawler import TweetsCrawler
from mpi4py import MPI
import sys
import getopt
import json
import threading


def gettweets(topic, city):
    worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret, conf["keywordsfile"][topic], [city,
    conf["location"][city]], conf["server"], conf["database"][topic], conf["languages"])
    worker.GetTweets()


if __name__ == "__main__":
    comm = MPI.COMM_WORLD  # create mpi
    RANK = comm.Get_rank()  # get the current process's rank
    SIZE = comm.Get_size()  # get the number of processes
    argv = sys.argv[1:]  # read input args except script's name  sys.argv[]
    opts, args = getopt.getopt(argv, "c:")
    for opt, arg in opts:
        if opt in ['-c']:
            configfilepath = arg
    configfilepath = "conf.json"
    f = open(configfilepath, 'r')
    conf = json.load(f)  # dict
    apikey = conf["apikey"]
    apisecret = conf["apisecret"]
    accesstoken = conf["accesstoken"]
    accesssecret = conf["accesssecret"]
    if RANK == 0:  # job
        try:
            t = threading.Thread(target=gettweets, args=["job", "melbourne"])
            t2 = threading.Thread(target=gettweets, args=["job", "sydney"])
            t.start()
            t2.start()
            t.join()
            t2.join()
        except:
            print("Error: cannot start threads job")
    elif RANK == 1:  # multiculture
        try:
            t = threading.Thread(target=gettweets, args=["multiculture", "melbourne"])
            t2 = threading.Thread(target=gettweets, args=["multiculture", "sydney"])
            t.start()
            t2.start()
            t.join()
            t2.join()
        except:
            print("Error: cannot start threads multiculture")
