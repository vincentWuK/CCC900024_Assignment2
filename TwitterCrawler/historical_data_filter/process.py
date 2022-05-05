from venv import create
import json
import os
import time
from textblob import TextBlob
import jionlp
import couchdb
from concurrent.futures import ThreadPoolExecutor
import subfinder
import threading
import numpy as np

FILENAME = "twitter-melb.json"
# SERVERPATH = "http://admin:admin@172.26.128.224:5984/"
SERVERPATH = "http://admin:admin@172.17.0.4:5984/"
THREADSNUM = 4
MULTICULTURELIMIT = 100000
JOBLIMIT = 100000
SERVER = couchdb.Server(SERVERPATH)
DB_JOB = SERVER["job"]
DB_MC = SERVER["multiculture"]
mc_count = 0
job_count = 0


def Splitfile(size):
    with open(FILENAME, 'r', encoding='utf-8') as f:
        file_size = os.path.getsize(FILENAME)
        chunk_estimated_size = file_size / (size * 2)
        chunk_start = [0]
        chunk_end = [0]
        f.readline()  # ignore the first line
        while (True):
            current_start = f.tell()
            chunk_start.append(current_start)
            f.seek(current_start + chunk_estimated_size)
            f.readline()
            current_end = f.tell()
            if current_end >= file_size:
                current_end = file_size
                chunk_end.append(current_end)
                return chunk_start, chunk_end
            chunk_end.append(current_end)
            f.seek(current_end)


def FormatJson(line):
    if line[-2] == ",":
        line = line[:-2]
    elif line[-2] == '}' and line[-3] == ']':
        line = line[:-3]
    return line


def CalCenter(boundingbox):
    lonlst = [boundingbox[0][0], boundingbox[1][0], boundingbox[2][0], boundingbox[3][0]]
    latlst = [boundingbox[0][1], boundingbox[1][1], boundingbox[2][1], boundingbox[3][1]]
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


def FindSuburb(coordinates, place, geofinder):
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
        long, lat = CalCenter(boundingbox)
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


def analysis(p):
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


def GetKeywords():
    f = open("keywords_job.txt")
    wordlist = f.readlines()
    return wordlist


def HasKeywords(wordlist, text):
    for w in wordlist:
        if w[:-1] in text:
            return True
    return False


def DeliverResult(my_chunk_start, my_chunk_end):
    global mc_count, job_count
    wordlist_unemployment = GetKeywords()
    geofinder = subfinder.subfinder()
    with open(FILENAME, 'r', encoding='utf-8') as f:
        f.seek(my_chunk_start)
        while (f.tell() < my_chunk_end):
            line = f.readline()  # read chunks' line
            if not line:
                break
            line = FormatJson(line)  # format line to json format
            try:
                tweet = json.loads(line)
            except BaseException as e:
                continue
            suburb = FindSuburb(tweet["doc"]['coordinates'],
                                tweet["doc"]['place'], geofinder)  # find the suburb
            text = jionlp.clean_text(tweet["doc"]['text'])  # clean the text
            mytextbolb = TextBlob(text)
            sentiment = analysis(mytextbolb)  # analyze sentiment
            if tweet["doc"]['lang'] in ["en", "es"]:
                lang = "en"
            else:
                lang = tweet["doc"]['lang']
            if mc_count < MULTICULTURELIMIT and suburb:
                try:
                    DB_MC.save({
                        '_id': str(tweet["id"]),
                        'lang': lang,
                        'suburb': suburb,
                        'sentiment': sentiment,
                        'created_at': tweet["doc"]["created_at"],
                        'text': tweet["doc"]['text']
                    })
                    mc_count += 1
                except BaseException as e:
                    continue
            if job_count < JOBLIMIT:
                if HasKeywords(wordlist_unemployment, text):
                    try:
                        DB_JOB.save({
                            '_id': str(tweet["id"]),
                            'city': "melbourne",
                            'sentiment': sentiment,
                            'created_at': tweet["doc"]["created_at"],
                            'text': tweet["doc"]['text']
                        })
                        job_count += 1
                    except BaseException:
                        continue
            if (mc_count >= MULTICULTURELIMIT) and (job_count >= JOBLIMIT):
                break


if __name__ == "__main__":
    chunk_start, chunk_end = Splitfile(THREADSNUM)  # 4 threads
    with ThreadPoolExecutor(max_workers=4) as pool:
        for i in range(4):
            try:
                pool.submit(DeliverResult, chunk_start[i], chunk_end[i])
            except BaseException as e:
                print(e)
