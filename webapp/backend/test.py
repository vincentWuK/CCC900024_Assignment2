from send_request import * 

print("=====================================TEST SENARIO1====================================================")

print("=================================== test cal_total_tweets_in_same_city================================")    
print(cal_total_tweets_in_same_city("2014-7-29", "2023-5-3"))
print("=================== test cal_total_tweets_in_the_suburb_speak_lan_with_every_sent===============================")  
print(cal_total_tweets_in_the_suburb_speak_lan_with_every_sent("2019-4-1", "2023-5-3", "fr,en,ja" , "sydney,melbourne,brisbane"))
print("=================================================================================================================") 
print(cal_total_tweets_in_the_suburb_speak_lan_with_every_sent("2020-5-1", "2020-5-2", "fr"))
print("=================== test cal_specific_day_in_the_suburb_speak_lan_with_every_sent===============================")  
print(cal_specific_day_in_the_suburb_speak_lan_with_every_sent("2014-7-29", "2014-7-30","en,in"))

print("=====================================TEST SENARIO2=====================================================")
print("=====================================sentiment proportion==============================================")
print(cal_sent_in_city('2022-5-6','2022-5-7'))
print("===========================cal_specific_day_in_the_city_with_every_sent proportion===========================")
print(cal_specific_day_in_the_city_with_every_sent('2022-5-6','2022-5-7'))
