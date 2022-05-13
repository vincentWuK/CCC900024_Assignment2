export const request_sentiment_analysis = (dates) => {
    return fetch(`/Sentiment_Analysis?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}`, {
        method: 'GET',
      }).then(response => {                                  
        return response.json()
      })
};

export const request_tweets_proportion = (dates) => {
  return fetch(`/total_tweets_proportion?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_Analysis = (dates) => {
  return fetch(`/daily_Analysis?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_sent_city = (dates) => {
  return fetch(`/daily_sent_city?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_sent_city = (dates) => {
  return fetch(`/sent_city?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}