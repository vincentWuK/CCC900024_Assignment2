from ast import Import
from operator import imod
import couchdb
import json
import requests
from dbSetting import * 

get_view_url = "http://{username}:{password}@{host}:{port}/{database}/_design/{design_doc}/_view/{view_name}?group_level={group_level}"

def creat_view(dbname, design_doc, viewname, mapfunction, reducefunction):
    data = {
        "_id": f"_design/{design_doc}",
        "language": "javascript",
        "views": {
            viewname:{
                "map" : mapfunction,
                "reduce":reducefunction
            }
        }
    }
    id = data['_id']
    if id in dbname:
        rev = dbname[id]['_rev']
        data['_rev'] = rev
    dbname.save(data)
#====================================================Senario 1:=======================================================================
multidb = couchdb.Server('http://' + username + ':' + password + '@' + multiculture_host + ':' + port)
multi = multidb['test_data']
view_name = 'lan'
lan_map = '''function (doc){ 
                var date = new Date(doc.created_at);
                date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                emit([date,doc.suburb,doc.lang, doc.sentiment], 1);
            }'''
count_reduce = '''_count'''

creat_view(multi, design_doc, view_name, lan_map, count_reduce)

def get_view(dataname,view_name, group_level):
    a = json.loads(requests.get(
    get_view_url.format(username=username,
                        password=password, 
                        host=multiculture_host, port=port,
                        database=dataname, 
                        design_doc=design_doc, 
                        view_name=view_name, 
                        group_level=group_level)
  ).content.decode("utf-8"))
    return a

#====================================================Senario 2:=======================================================================
jobdb = couchdb.Server('http://' + username + ':' + password + '@' + job_host + ':' + port)
job = jobdb[job_database]
view_name2 = 'job'
sent_map='''function (doc){ 
                var date = new Date(doc.created_at);
                date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                emit([date,doc.city, doc.sentiment], 1);
            }'''
            
creat_view(job, design_doc, view_name2, sent_map, count_reduce)

def get_job_view(dataname,view_name, group_level):
    a = json.loads(requests.get(
    get_view_url.format(username=username,
                        password=password, 
                        host=job_host, port=port,
                        database=dataname, 
                        design_doc=design_doc, 
                        view_name=view_name, 
                        group_level=group_level)
  ).content.decode("utf-8"))
    return a
