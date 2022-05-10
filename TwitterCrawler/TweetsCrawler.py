import enum
from twarc import Twarc
import ijson
from textblob import TextBlob
import re
import couchdb
import jionlp
import subfinder
import tweepy
import numpy as np
from langcodes import *

NEED = [
    "Carlton", "Docklands", "East Melbourne", "Kensington", "North Melbourne",
    "Parkville", "Port Melbourne", "Southbank", "South Yarra",
    "West Melbourne", "Melbourne"
]


class TweetsCrawler:
    def __init__(self, apikey, apisecret, accesstoken, accesssecret,
                 bearer_token, keyw_path, locations, serverpath, databasename):
        self.apikey = apikey
        self.apisecret = apisecret
        self.accesstoken = accesstoken
        self.accesssecret = accesssecret
        self.keywords_path = keyw_path
        self.server_path = serverpath
        self.bearer_token = bearer_token
        self.database_name = databasename
        self.location = locations[2]
        self.location_name = locations[0]
        self.suburb = locations[1]
        self.stream = None

    def analysis(self, text):
        p = TextBlob(text)
        if p.sentiment.polarity < -0.55:
            return "very negative"
        elif p.sentiment.polarity < -0.15:
            return "negative"
        elif p.sentiment.polarity > 0.55:
            return "very positive"
        elif p.sentiment.polarity > 0.15:
            return "positive"
        else:
            return "neutral"

    def GetKeywords(self):
        f = open(self.keywords_path)
        wordlist = f.readlines()
        for index, word in enumerate(wordlist):
            wordlist[index] = word[:-1]
        return wordlist

    def HasKeywords(self, wordlist, text):
        for w in wordlist:
            if w in text:
                return True
        return False

    def CalCenter(self, boundingbox):
        lonlst = [
            boundingbox[0][0], boundingbox[1][0], boundingbox[2][0],
            boundingbox[3][0]
        ]
        latlst = [
            boundingbox[0][1], boundingbox[1][1], boundingbox[2][1],
            boundingbox[3][1]
        ]
        num_coords = 4
        X = 0.0
        Y = 0.0
        Z = 0.0
        for i in range(4):
            lat = latlst[i] * np.pi / 180
            lon = lonlst[i] * np.pi / 180
            a = np.cos(lat) * np.cos(lon)
            b = np.cos(lat) * np.sin(lon)
            c = np.sin(lat)
            X += a
            Y += b
            Z += c
        X /= num_coords
        Y /= num_coords
        Z /= num_coords
        lon = np.arctan2(Y, X)
        hyp = np.sqrt(X * X + Y * Y)
        lat = np.arctan2(Z, hyp)
        lat_center = (lat * 180 / np.pi)
        lon_center = (lon * 180 / np.pi)
        return lon_center, lat_center

    def findsuburb(self, place, coordinates, geofinder):
        if coordinates:
            coordinates = coordinates["coordinates"]
            try:
                location = geofinder.GetPlace(coordinates[1], coordinates[0])
            except BaseException as e:
                return None
            try:
                suburb = location["suburb"]
                return suburb
            except BaseException as e:
                return None
        elif place:
            boundingbox = place["bounding_box"]["coordinates"][0]
            long, lat = self.CalCenter(boundingbox)
            try:
                location = geofinder.GetPlace(lat, long)
            except BaseException as e:
                print("cannot use subfinder in bounding box", e)
                return None
            try:
                suburb = location["suburb"]
                return suburb
            except BaseException as e:
                return None
        else:
            return None

    def GetTweetsStream(self):
        try:
            self.stream = Twarc(self.apikey, self.apisecret, self.accesstoken,
                                self.accesssecret)
        except self.stream.http_errors as e:
            print("stream init error! ", e)
        wordlist = self.GetKeywords()
        try:
            server = couchdb.Server(self.server_path)
            db = server[self.database_name]
            count_stream = 0
            geofinder = subfinder.subfinder()
            if not self.suburb:
                for tweet in self.stream.filter(track=wordlist,
                                                locations=self.location):
                    count_stream += 1
                    if count_stream > 50000:  # get 50000 datas then quit
                        break
                    try:
                        text = jionlp.clean_text(tweet["text"])
                        sentiment = self.analysis(text)
                        lang = Language.make(
                            language=tweet["lang"]).display_name()
                        try:
                            db.save({
                                '_id': str(tweet["id"]),
                                'city': self.location_name,
                                'sentiment': sentiment,
                                'created_at': tweet["created_at"],
                                'text': tweet["text"]
                            })
                        except BaseException:
                            pass
                    except BaseException:
                        continue
            else:  # suburb mode
                if self.suburb != "no":
                    for tweet in self.stream.filter(track=wordlist,
                                                    locations=self.location):
                        count_stream += 1
                        if count_stream > 10000:  # get 10000 tweets then exit
                            break
                        try:
                            text = jionlp.clean_text(tweet["text"])
                            sentiment = self.analysis(text)
                            suburb = self.suburb
                            lang = Language.make(
                                language=tweet["lang"]).display_name()
                            try:
                                db.save({
                                    '_id': str(tweet["id"]),
                                    'lang': lang,
                                    'suburb': suburb,
                                    'sentiment': sentiment,
                                    'created_at': tweet["created_at"],
                                    "text": tweet["text"]
                                })
                            except BaseException as e:
                                pass
                        except BaseException as e:
                            print(e)
                            pass
                else:
                    for tweet in self.stream.filter(track=wordlist,
                                                    locations=self.location):
                        count_stream += 1
                        if count_stream > 10000:  # get 10000 tweets then exit
                            break
                        try:
                            text = jionlp.clean_text(tweet["text"])
                            sentiment = self.analysis(text)
                            suburb = self.findsuburb(tweet["place"],
                                                     tweet["coordinates"],
                                                     geofinder)
                            lang = Language.make(
                                language=tweet["lang"]).display_name()
                            if suburb not in NEED:
                                try:
                                    db.save({
                                        '_id': str(tweet["id"]),
                                        'lang': lang,
                                        'suburb': suburb,
                                        'sentiment': sentiment,
                                        'created_at': tweet["created_at"],
                                        "text": tweet["text"]
                                    })
                                except BaseException as e:
                                    pass
                            else:
                                db2 = server["multiculture"]
                                try:
                                    db2.save({
                                        '_id': str(tweet["id"]),
                                        'lang': lang,
                                        'suburb': suburb,
                                        'sentiment': sentiment,
                                        'created_at': tweet["created_at"],
                                        "text": tweet["text"]
                                    })
                                except BaseException as e:
                                    pass
                        except BaseException as e:
                            print(e)
                            pass
        except Exception as e:
            print(e)

    def SearchTweetsAll(self):
        auth = tweepy.OAuth2BearerHandler(self.bearer_token)
        api = tweepy.API(auth)
        wordlist = self.GetKeywords()
        query = ""
        querylst = []
        server = couchdb.Server(self.server_path)
        db = server[self.database_name]
        for word in wordlist:
            if query:
                query = query + " OR " + "\"" + word + "\""
            else:
                query = "\"" + word + "\""
            if len(query) > 90:
                query = query + " place:" + self.suburb
                querylst.append(query)
                query = ""
        for index, q in enumerate(querylst):
            for i in range(1):  # search 100 tweets
                try:
                    lst = api.search_full_archive(label="development",
                                                  query=q,
                                                  maxResults=100,
                                                  fromDate="202001010000",
                                                  toDate="202101010000")
                except BaseException as e:
                    print("cannot search all days tweets: ", e)
                for tweet in lst:
                    try:
                        text = jionlp.clean_text(tweet.text)
                        sentiment = self.analysis(text)
                        lang = Language.make(
                            language=tweet.lang).display_name()
                        try:
                            db.save({
                                '_id': str(tweet.id_str),
                                'lang': lang,
                                'suburb': self.suburb,
                                'sentiment': sentiment,
                                'created_at': str(tweet.created_at),
                                "text": tweet.text
                            })
                        except BaseException as e:
                            pass
                    except BaseException as e:
                        print(e)

    def Search30Days(self):
        auth = tweepy.OAuth2BearerHandler(self.bearer_token)
        api = tweepy.API(auth)
        wordlist = self.GetKeywords()
        query = ""
        querylst = []
        server = couchdb.Server(self.server_path)
        db = server[self.database_name]
        for word in wordlist:
            if query:
                query = query + " OR " + "\"" + word + "\""
            else:
                query = "\"" + word + "\""
            if len(query) > 200:
                query = query + " place:" + self.suburb
                querylst.append(query)
                query = ""
        for q in querylst:
            for i in range(2):  # search 200 tweets
                try:
                    lst = api.search_30_day(label="development",
                                            query=q,
                                            maxResults=100)
                except BaseException as e:
                    print("cannot search 30 days tweets: ", e)
                for tweet in lst:
                    try:
                        text = jionlp.clean_text(tweet.text)
                        sentiment = self.analysis(text)
                        lang = Language.make(
                            language=tweet.lang).display_name()
                        try:
                            db.save({
                                '_id': str(tweet.id_str),
                                'lang': lang,
                                'suburb': self.suburb,
                                'sentiment': sentiment,
                                'created_at': str(tweet.created_at),
                                "text": tweet.text
                            })
                        except BaseException as e:
                            pass
                    except BaseException as e:
                        print(e)
