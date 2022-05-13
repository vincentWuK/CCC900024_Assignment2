export const request_sentiment_analysis = (homeDates) => {
    return fetch(`/Sentiment_Analysis?from_date=${encodeURIComponent(homeDates.from_date)}&to_date=${encodeURIComponent(homeDates.to_date)}&suburb=Carlton,Dockerland,Melbourne&lan=en,ja,in`, {
        method: 'GET',
      }).then(response => {                                  
        return response.json()
      })
};

export const request_tweets_proportion = (homeDates) => {
  return fetch(`/total_tweets_proportion?from_date=${encodeURIComponent(homeDates.from_date)}&to_date=${encodeURIComponent(homeDates.to_date)}&suburb=Carlton,Dockerland,Melbourne&lan=en,ja,in`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_Analysis = (homeDates) => {
  return fetch(`/daily_Analysis?from_date=${encodeURIComponent(homeDates.from_date)}&to_date=${encodeURIComponent(homeDates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_sent_city = (homeDates) => {
  return fetch(`/daily_sent_city?from_date=${encodeURIComponent(homeDates.from_date)}&to_date=${encodeURIComponent(homeDates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_sent_city = (homeDates) => {
  return fetch(`/sent_city?from_date=${encodeURIComponent(homeDates.from_date)}&to_date=${encodeURIComponent(homeDates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}