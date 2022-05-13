export const request_sentiment_analysis = (dates) => {
    return fetch(`/Sentiment_Analysis?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}&suburb=Melbourne,Carlton,Docklands,East Melbourne,Kensington,North Melbourne,Parkville,Port Melbourne,Southbank,South Yarra,West Melbourne&lan=English,French,Japanese,Indonesian,Thai,Portuguese`, {
        method: 'GET',
      }).then(response => {                                  
        return response.json()
      })
};

export const request_tweets_proportion = (dates) => {
  return fetch(`/total_tweets_proportion?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}&suburb=Melbourne,Carlton,Docklands,East Melbourne,Kensington,North Melbourne,Parkville,Port Melbourne,Southbank,South Yarra,West Melbourne&lan=English,French,Japanese,Indonesian,Thai,Portuguese`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_Analysis = (dates) => {
  return fetch(`/daily_Analysis?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}&suburb=Melbourne,Carlton,Docklands,East Melbourne,Kensington,North Melbourne,Parkville,Port Melbourne,Southbank,South Yarra,West Melbourne&lan=en,in`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_daily_sent_city = (dates) => {
  return fetch(`/daily_sent_city?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}&city=Sydney,Melbourne,Brisbane,Adelaide&lan=English,French,Japanese,Indonesian,Thai,Portuguese`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}

export const request_sent_city = (dates) => {
  return fetch(`/sent_city?from_date=${encodeURIComponent(dates.from_date)}&to_date=${encodeURIComponent(dates.to_date)}&city=Sydney,Melbourne,Brisbane,Adelaide&lan=English,French,Japanese,Indonesian,Thai,Portuguese`, {
    method: 'GET', 
  }).then(response => {
    return response.json()
  })
}