from operator import imod
import couchdb
import json
import requests

username = "admin"
password = "admin"
host = "172.26.128.57"
port = "5984"
datebase2 = "job"
databse_name = couchdb.Server('http://' + username + ':' + password + '@' + host + ':' + port)
dbname2 = databse_name[datebase2]
design_doc  = "ANALYSIS"
view_name2 = 'job'
get_view_url = "http://{username}:{password}@{host}:{port}/{database}/_design/{design_doc}/_view/{view_name}?group_level={group_level}"

def creat_job_view(dbname, design_doc, viewname, mapfunction, reducefunction):
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
    
lan_map = '''function (doc){ 
                var date = new Date(doc.created_at);
                date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                emit([date,doc.city, doc.sentiment], 1);
            }'''
count_reduce = '''_count'''

creat_job_view(dbname2, design_doc, view_name2, lan_map, count_reduce)

def get_job_view(dataname,view_name, group_level):
    a = json.loads(requests.get(
    get_view_url.format(username=username,
                        password=password, 
                        host=host, port=port,
                        database=dataname, 
                        design_doc=design_doc, 
                        view_name=view_name, 
                        group_level=group_level)
  ).content.decode("utf-8"))
    return a
