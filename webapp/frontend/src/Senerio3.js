import React, { useState } from 'react';
import { Chart } from "react-google-charts";

function Senerio3() {
  const options = {
    chart: {
      title: "Sentiments",
      subtitle: "",
      isStacked: true,
    },
  };

  const [moodTest, setmoodTest] = useState({})

  function toList(suburbMood, suburb) {
    var table = [["Suburb", "very positive", "positive", "neutral", "negative", "very negative"]]
    const moods = ["very positive", "positive", "neutral", "negative", "very negative"]
    var allMoods = [suburb]
    for (const i in moods) {
      allMoods.push(suburbMood[moods[i]])
    }
    table.push(allMoods)
    console.log(table)
    return table
  }

  return (
    <div className='senerio3'>
      { moodTest !== {} && Object.keys(moodTest).map((suburb) => (
        <Chart
          chartType="ColumnChart"
          data={toList(moodTest[suburb], suburb)}
          width="300px"
          height="250px"
          options={options}
        />
      ))}
    </div>
  );
}

export default Senerio3;