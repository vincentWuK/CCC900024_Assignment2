from ctypes import util
import datetime
from datetime import timedelta
from flask import request, jsonify
from flask_restful import Resource
from db_manage import *
from decimal import *
from flask_restful import Resource
from util import *

#=================================================Senario1=============================================================
class Total_Tweest_Proportion(Resource):
    def get(self):
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        request_suburb = request.args.get('suburb', default = SUBURB_STR)
        request_lan = request.args.get('lan',default=LAN_STR)
        result = cal_total_tweets_in_same_city(from_date, to_date, request_suburb, request_lan)
        resp = jsonify(result)
        resp.status_code = 200
        return resp
'''
#METHOD = GET
#request = {"from": "2021-05-03",
#            "to" : "2022-02-03",
#            "lan" : "ch,en,fr"}
'''

class Sentiment_Analysis(Resource):
    def get(self):
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        request_suburb = request.args.get('suburb',default = SUBURB_STR)
        request_lan = request.args.get('lan',default=LAN_STR)
        result = cal_total_tweets_in_the_suburb_speak_lan_with_every_sent(from_date, to_date, request_lan,request_suburb)
        resp = jsonify(result)
        resp.status_code = 200
        return resp

class Daily_Analysis(Resource):
    def get(self):
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        request_suburb = request.args.get('suburb',default = SUBURB_STR)
        request_lan = request.args.get('lan',default=LAN_STR)
        result = cal_specific_day_in_the_suburb_speak_lan_with_every_sent(from_date, to_date, request_lan, request_suburb)
        resp = jsonify(result)
        resp.status_code = 200
        return resp


#=================================================Senario2=============================================================
class sent_city(Resource):
    def get(self):
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        city = request.args.get('city',default=CITY_STR)
        result = cal_sent_in_city(from_date,to_date,city)
        resp = jsonify(result)
        resp.status_code = 200
        return resp

class daily_sent_city(Resource):
    def get(self):
        from_date = request.args.get('from_date')
        to_date = request.args.get('to_date')
        city = request.args.get('city',default=CITY_STR)
        result =  cal_specific_day_in_the_city_with_every_sent(from_date, to_date, city)
        resp = jsonify(result)
        resp.status_code = 200
        return resp


''''   
METHOD = GET
request = {"from": "2021-5-3",
                "to" : "2022-2-3",
                "city": "sydney,melbourne"
                "lan" : "ch,en,fr"}
'''

def cal_total_twitters_in_the_suburb(from_date, to_date, suburb):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    time_suburb_row = get_view('multiculture','lan',2)
    time_suburb = time_suburb_row['rows']
    total = 0
    for item in time_suburb:
        t1 = item['key'][0]         
        s1 = item['key'][1]
        count = item['value']   
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and suburb == s1:
            total = count +total
    return total

def cal_total_tweets_in_same_city(from_date, to_date, suburb=SUBURB_STR, lan=LAN_STR):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    suburb_list = suburb.split(',')
    #print(suburb_list)
    lan_list = lan.split(',')
    #print(lan_list)
    suburb_lan_num_dict = {}
    time_suburb_lan_row = get_view('multiculture','lan',3)
    time_suburb_lan = time_suburb_lan_row['rows']
    for item in time_suburb_lan:
        t1 = item['key'][0]
        suburb = item['key'][1]
        #print(str(suburb) +" is suburb")
        lan = item['key'][2]
        count = item['value']
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and suburb in suburb_list and lan in lan_list:
            if suburb in suburb_lan_num_dict:
                if lan in suburb_lan_num_dict[suburb]:
                    suburb_lan_num_dict[suburb][lan] += count
                else:
                    suburb_lan_num_dict[suburb][lan] = count
            else:
                suburb_lan_num_dict[suburb] = {}
                suburb_lan_num_dict[suburb][lan] = count
  
    # for key in suburb_lan_num_dict:
    #     others_percent = 1
    #     total_twitters_in_the_suburb = cal_total_twitters_in_the_suburb(from_date, to_date, key)
    #     lan_dict = suburb_lan_num_dict[key]
    #     for lan in lan_dict:
    #         a = lan_dict[lan] / total_twitters_in_the_suburb
    #         lan_dict[lan] = a
    #         others_percent = others_percent - a 
    #     lan_dict['others'] = others_percent
        
    # for key in suburb_lan_num_dict:
    #     lan_dict = suburb_lan_num_dict[key]
    #     for lan in lan_dict:
    #         lan_dict[lan] = round(lan_dict[lan],3)  
            
    for key in suburb_lan_num_dict:
        lan_dict = suburb_lan_num_dict[key]
        for lans in lan_list:
            if lans not in lan_dict:
                lan_dict[lans] = 0
            
    #result: {'melbourne': {'fr': 0.333, 'en': 0.167, 'ja': 0.5, 'others': 0.0}, 
    # 'brisbane': {'en': 0.5, 'ja': 0.5, 'others': 0.0}, 
    # 'sydney': {'en': 0.5, 'fr': 0.25, 'ja': 0.25, 'others': 0.0}}
    return suburb_lan_num_dict

# print("========================== test cal_total_tweets_in_same_city========================")    
# print(cal_total_tweets_in_same_city("2014-7-29", "2023-5-3"))


def cal_total_tweets_in_the_suburb_speak_lan(from_date, to_date, lan = LAN_STR, suburb = SUBURB_STR):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    time_suburb_lan_row = get_view('multiculture','lan',3)
    time_suburb_lan = time_suburb_lan_row['rows']
    total = 0
    for item in time_suburb_lan:
        t1 = item['key'][0]         
        s1 = item['key'][1]
        la = item['key'][2]
        count = item['value']
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and s1 in suburb and la in lan:
            total = count + total
    #print(str(suburb)+"'s total is " +str(total))
    return total

#print("====================== test cal_total_tweets_in_the_suburb_speak_lan======================")
#cal_total_tweets_in_the_suburb_speak_lan("2019-4-1", "2023-5-3", "fr" , "sydney,melbourne,brisbane")

'''
METHOD = GET
request = {"from": "2021-05-03",
            "to" : "2022-02-03",
            "lan" : "ch,en,fr"}
'''

def create_basic_suburb_lan_sent_num_dict(suburb,senti):
    
    suburb_dict = {}
    sub = suburb.split(",")
    
    for su in sub:
        sen_dict = {}
        sent = senti.split(",")
        for sen in sent:
            sen_dict[sen] = 0
        suburb_dict[su] = sen_dict
    return suburb_dict

def cal_total_tweets_in_the_suburb_speak_lan_with_every_sent(from_date, to_date,lan = LAN_STR, suburb = SUBURB_STR,sent = SENTIMENT):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    suburb_list = suburb.split(',')
    time_suburb_lan_sent_row = get_view('multiculture','lan',4)
    time_suburb_lan_sent = time_suburb_lan_sent_row['rows']
    suburb_lan_sent_num_dict = create_basic_suburb_lan_sent_num_dict(suburb,sent)
    total = 0
    for item in time_suburb_lan_sent:
        t1 = item['key'][0]         
        su = item['key'][1]
        la = item['key'][2]
        se = item['key'][3]
        count = item['value']
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and su in suburb_list and la in lan and se in sent:
            total = count + total
            if su in suburb_lan_sent_num_dict:
                suburb_lan_sent_num_dict[su][se] += count
            else:
                suburb_lan_sent_num_dict[su] = {}
                suburb_lan_sent_num_dict[su][se] = count
    for key in suburb_lan_sent_num_dict:
        sen_dict = suburb_lan_sent_num_dict[key]
        total = 0
        for sen in sen_dict:
            total += sen_dict[sen]
        for sen in sen_dict:
            if total != 0:
                a = sen_dict[sen] / total
            else:
                a = sen_dict[sen]
            sen_dict[sen] = a
            
    for key in suburb_lan_sent_num_dict:
        sen_dict = suburb_lan_sent_num_dict[key]
        for sen in sen_dict:
            sen_dict[sen] = round(sen_dict[sen],3)
    lan_list = SENTIMENT.split(',')
    for key in suburb_lan_sent_num_dict:
        lan_dict = suburb_lan_sent_num_dict[key]
        for lans in lan_list:
            if lans not in lan_dict:
                lan_dict[lans] = 0 
    return suburb_lan_sent_num_dict
# print("=================== test cal_total_tweets_in_the_suburb_speak_lan_with_every_sent===============================")  
# print(cal_total_tweets_in_the_suburb_speak_lan_with_every_sent("2019-4-1", "2023-5-3", "fr,en,ja" , "sydney,melbourne,brisbane"))
# print("=================================================================================================================") 
# print(cal_total_tweets_in_the_suburb_speak_lan_with_every_sent("2020-5-1", "2020-5-2", "fr"))
#cal_total_tweets_in_the_suburb_speak_lan_with_every_sent("2019-4-1", "2023-5-3", "fr" , "sydney,melbourne,brisbane")

def cal_specific_day_in_the_suburb_speak_lan_with_every_sent(from_d, to_d,
                                                             lan = LAN_STR, suburbs = SUBURB_STR,sent = SENTIMENT):
    keys = ("date", "value")
    date_value_dict = dict.fromkeys(keys)
    from_da = datetime.datetime.strptime(from_d, '%Y-%m-%d')
    to_da = datetime.datetime.strptime(to_d, '%Y-%m-%d')
    curr = from_da
    i = 0
    curr = datetime.datetime.strftime(curr,'%Y-%m-%d')
    result = cal_total_tweets_in_the_suburb_speak_lan_with_every_sent(curr, curr,lan, suburbs, sent)
    #print(result)
    while from_da <= to_da:
        curr = from_da
        curr = datetime.datetime.strftime(curr,'%Y-%m-%d')
        cur_date_por_dict = cal_total_tweets_in_the_suburb_speak_lan_with_every_sent(curr, curr,lan, suburbs, sent)
        for suburb in cur_date_por_dict:
            for sen in cur_date_por_dict[suburb]:
                por = cur_date_por_dict[suburb][sen]
                keys = ("date", "value")
                date_value_dict = dict.fromkeys(keys)
                date_str = from_da.strftime('%Y-%m-%d')
                date_value_dict["date"] = date_str
                date_value_dict["value"] =por
                if i == 0:
                    #print(date_value_dict)
                    new_sen_list = []
                    new_sen_list.append(date_value_dict)
                    result[suburb][sen] = new_sen_list
                    #print(result[suburb][sen])
                else:
                    result[suburb][sen].append(date_value_dict)
        i+=1
        from_da = from_da + timedelta(days=1)
    return result
# print("=================== test cal_specific_day_in_the_suburb_speak_lan_with_every_sent===============================")  
# print(cal_specific_day_in_the_suburb_speak_lan_with_every_sent("2014-7-29", "2014-7-30","en,in", SUBURB_STR))

#=================================================Senario 2==============================================================


def cal_total_twitters_in_the_city(from_date, to_date, suburb):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    time_suburb_row = get_job_view('job','job',2)
    time_suburb = time_suburb_row['rows']
    total = 0
    for item in time_suburb:
        t1 = item['key'][0]         
        s1 = item['key'][1]
        count = item['value']   
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and suburb == s1:
            total = count +total
    return total


def cal_sent_in_city(from_date,to_date,city = CITY_STR):
    from_d = datetime.datetime.strptime(from_date, '%Y-%m-%d')
    to_d = datetime.datetime.strptime(to_date, '%Y-%m-%d')
    city_list = city.split(',')
#    city_sen_num_dict = {}
    time_city_sen_row = get_job_view('job','job',3)
    time_city_sen = time_city_sen_row['rows']
    city_sen_num_dict = create_basic_suburb_lan_sent_num_dict(CITY_STR,SENTIMENT)
    for item in time_city_sen:
        t1 = item['key'][0]
        city = item['key'][1]
        sen = item['key'][2]
        count = item['value']
        t1 = datetime.datetime.strptime(t1,"%Y-%m-%d")
        if t1 >= from_d and t1 <= to_d and city in city_list:
            if city in city_sen_num_dict:
                if sen in city_sen_num_dict[city]:
                    city_sen_num_dict[city][sen] += count
                else:
                    city_sen_num_dict[city][sen] = count
            else:
                city_sen_num_dict[city] = {}
                city_sen_num_dict[city][sen] = count
    
    for key in city_sen_num_dict:
        lan_dict = city_sen_num_dict[key]
        total = 0
        for lan in lan_dict:
            total += lan_dict[lan]
        for lan in lan_dict:
            if total != 0:
                a = lan_dict[lan] / total
            else:
                a = lan_dict[lan]
            lan_dict[lan] = a
            
    for key in city_sen_num_dict:
        lan_dict = city_sen_num_dict[key]
        for lan in lan_dict:
            lan_dict[lan] = round(lan_dict[lan],3)
            
    lan_list = SENTIMENT.split(',')
    for key in city_sen_num_dict:
        lan_dict = city_sen_num_dict[key]
        for lans in lan_list:
            if lans not in lan_dict:
                lan_dict[lans] = 0  
 
    return city_sen_num_dict


def cal_specific_day_in_the_city_with_every_sent(from_d, to_d, suburbs = CITY_STR):
    keys = ("date", "value")
    date_value_dict = dict.fromkeys(keys)
    from_da = datetime.datetime.strptime(from_d, '%Y-%m-%d')
    to_da = datetime.datetime.strptime(to_d, '%Y-%m-%d')
    curr = from_da
    i = 0
    curr = datetime.datetime.strftime(curr,'%Y-%m-%d')
    result = cal_sent_in_city(curr, curr,suburbs)
    while from_da <= to_da:
        curr = from_da
        curr = datetime.datetime.strftime(curr,'%Y-%m-%d')
        cur_date_por_dict =  cal_sent_in_city(curr, curr,suburbs)
        
        #print(cur_date_por_dict)
        for suburb in cur_date_por_dict:
            for sen in cur_date_por_dict[suburb]:
                por = cur_date_por_dict[suburb][sen]
                keys = ("date", "value")
                date_value_dict = dict.fromkeys(keys)
                date_str = from_da.strftime('%Y-%m-%d')
                #print("curr time is "+ str(date_str))
                date_value_dict["date"] = date_str
                date_value_dict["value"] =por
                if i == 0:
                   # print(date_value_dict)
                    new_sen_list = []
                    new_sen_list.append(date_value_dict)
                    result[suburb][sen] = new_sen_list
                    #print(result[suburb][sen])
                else:
                    result[suburb][sen].append(date_value_dict)
        i+=1
        from_da = from_da + timedelta(days=1)
    return result