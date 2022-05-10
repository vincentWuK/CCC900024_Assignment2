from TweetsCrawler import TweetsCrawler
import json
from FindBBox import FindBBox

topic = "multiculture"
f = open("conf_localtest.json", 'r')
conf = json.load(f)  # dict
city = "melbourne"
sub = conf["suburb"]
apikey = conf["auth"][str(1)]["apikey"]
apisecret = conf["auth"][str(1)]["apisecret"]
accesstoken = conf["auth"][str(1)]["accesstoken"]
accesssecret = conf["auth"][str(1)]["accesssecret"]
bearer_token = conf["auth"][str(1)]["bearer_token"]
for s in sub:
    name = s + ", " + city
    try:
        bbox = FindBBox(name)
    except BaseException as e:
        print("cannot find bbox: ", e)
    worker = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                           bearer_token, conf["keywordsfile"][topic],
                           [city, s, bbox], conf["server"],
                           "multiculture_hasgeo_all")
    worker.SearchTweetsAll()
f.close()
