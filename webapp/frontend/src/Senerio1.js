import React, { useState } from 'react';
import { Chart } from "react-google-charts";
import './Senerio.css'
import './Paper.css'

function Senerio1() {
  const options = {
    chart: {
      title: "Sentiments",
      subtitle: "",
    },
  };

  const [totalSentiments, setTotalSentiments] = useState({})

  function toList(suburbSentiment) {
    var table = []
    table.push(["date", "very positive", "positive", "neutral", "negative", "very negative"])
    var dates = []
    var temp_key = Object.keys(suburbSentiment)[0]
    
    for (const i in suburbSentiment[temp_key]) {
      dates.push(suburbSentiment[temp_key][i].date)
    }

    var sentiments = ["very positive", "positive", "neutral", "negative", "very negative"]

    for (const i in dates) {
      var sentiment_row = [dates[i]]
      for (const j in sentiments) {
        var value = -1;
        for (const k in suburbSentiment[sentiments[j]]) {
          if (suburbSentiment[sentiments[j]][k].date === dates[i]) {
            value = suburbSentiment[sentiments[j]][k].value
            break
          }
        }
        sentiment_row.push(value)
      }
      table.push(sentiment_row)
    }
    return table
  }

  return (
    <div class="container">
      <header class="header">
        header
      </header>
      <main class="container__main">
        <left class="container__left">
          aaa
        </left>
        <display class="container__middle">
          { totalSentiments !== {} && Object.keys(totalSentiments).map((suburb) => (
            <Chart
              chartType="Bar"
              data={toList(totalSentiments[suburb])}
              width="300px"
              height="250px"
              options={options}
              legendToggle
            />
          ))}
        </display>
      </main>
    </div>
  );
}

export default Senerio1;