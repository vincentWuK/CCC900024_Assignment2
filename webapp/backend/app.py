from flask import Flask
from flask_restful import Api
from send_request import *

app = Flask(__name__)
api = Api(app)

api.add_resource(Total_Tweest_Proportion, "/total_tweets_proportion", endpoint='total_tweets_proportion')
api.add_resource(Sentiment_Analysis, "/Sentiment_Analysis", endpoint='Sentiment_Analysis')
api.add_resource(Daily_Analysis, "/daily_Analysis", endpoint='daily_Analysis')
api.add_resource(sent_city, "/sent_city", endpoint='sent_city')
api.add_resource(daily_sent_city, "/daily_sent_city", endpoint='daily_sent_city')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')