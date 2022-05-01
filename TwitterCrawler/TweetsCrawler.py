from twarc import Twarc
import ijson
from textblob import TextBlob
import re
import couchdb
import jionlp
from geopy.geocoders import Nominatim
import logging


def analysis(text):
    p = TextBlob(jionlp.clean_text(text))
    if p.sentiment.polarity < -0.6:
        return "very negative"
    elif p.sentiment.polarity < -0.2:
        return "negative"
    elif p.sentiment.polarity > 0.6:
        return "very positive"
    elif p.sentiment.polarity > 0.2:
        return "positive"
    else:
        return "neutral"


def subjectivity(text):
    p = TextBlob(jionlp.clean_text(text))
    if p.sentiment.subjectivity > 0.2:
        return True
    else:
        return False


class TweetsCrawler:
    def __init__(self, apikey, apisecret, accesstoken, accesssecret, keyw_path,
                 locations, serverpath, databasename, langlist):
        self.apikey = apikey
        self.apisecret = apisecret
        self.accesstoken = accesstoken
        self.accesssecret = accesssecret
        self.keywords_path = keyw_path
        self.server_path = serverpath
        self.database_name = databasename
        self.location = locations[1]
        self.location_name = locations[0]
        self.langlist = langlist
        self.stream = None

    def GetKeywords(self):
        f = open(self.keywords_path)
        wordlist = f.readlines()
        return wordlist

    def findsuburb(self, place, coordinates):
        geolocator = Nominatim(user_agent="findsuburb")
        if coordinates:
            coordinates = coordinates["coordinates"]
            coordinates.reverse()
            strlist = [str(x) for x in coordinates]
            strlist = ','.join(strlist)
            location = geolocator.reverse(strlist).raw
            return location["address"]["suburb"]
        elif place:
            boundingbox = place["bounding_box"]["coordinates"][0]
            long = (boundingbox[0][0] + boundingbox[1][0] + boundingbox[2][0] + boundingbox[3][0]) / 4
            lat = (boundingbox[0][1] + boundingbox[1][1] + boundingbox[2][1] + boundingbox[3][1]) / 4
            location = geolocator.reverse(str(lat) + ',' + str(long))
            return location.raw["address"]["suburb"]
        else:
            return None

    def GetTweets(self):
        try:
            self.stream = Twarc(self.apikey, self.apisecret, self.accesstoken, self.accesssecret)
        except self.stream.http_errors as e:
            logger = logging.getLogger("stream")
            logger.setLevel(logging.ERROR)
        wordlist = self.GetKeywords()
        try:
            for tweet in self.stream.filter(track=wordlist, lang=self.langlist, locations=self.location):
                text = jionlp.clean_text(tweet["text"])
                sentiment = analysis(text)
                sub = subjectivity(text)
                server = couchdb.Server(self.server_path)
                db = server[self.database_name]
                if self.database_name == "multiculture":
                    db.save({
                        'city': self.location_name,
                        'lang': tweet["lang"],
                        'sentiment': sentiment,
                        'created_at': tweet["created_at"]
                    })
                elif self.database_name == "job":
                    suburb = self.findsuburb(tweet["place"], tweet["coordinates"])
                    if suburb and sub:
                        db.save({
                            'city': self.location_name,
                            'suburb': suburb,
                            'sentiment': sentiment,
                            'created_at': tweet["created_at"]
                        })
        except Exception as e:
            print("filter")


# test
if __name__ == "__main__":
    apikey = 'HrfRYhymphtDMrEhDdNa5kFU8'
    apisecret = '4jaIGUPfwpGSHz6cIXse4g1MljY1tFVdqTrLgLHToaIa5dkKOR'
    accesstoken = '1516266958232375299-uBLYr15LDOdK47XsPctWU7xPyPs1Lh'
    accesssecret = 'l9bLNZkTQoO0AiUcZ4YwugZC4ZYdobumIyTSU13uYlepA'
    tc = TweetsCrawler(apikey, apisecret, accesstoken, accesssecret,
                       'keywords_job.txt', ["adelaide", "112.28, -44.36, 155.23, -10.37"],
                       'http://admin:admin@172.17.0.4:5984/', 'job', "en, fr")
    tc.GetTweets()
