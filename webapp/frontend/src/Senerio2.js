import React, { useState } from 'react';
import { Chart } from "react-google-charts";

function Senerio2() {
  const options = {
    chart: {
      title: "Sentiments",
      subtitle: "",
    },
  };

  const [lanTest, setlanTest] = useState({})

  function toList(suburbLang) {
    var table = [["language", "ratio"]]
    const langs = Object.keys(suburbLang)
    for (const i in langs) {
      table.push([langs[i], suburbLang[langs[i]]])
    }
    console.log(table)
    return table
  }

  return (
    <div className='senerio2'>
      { lanTest !== {} && Object.keys(lanTest).map((suburb) => (
        <Chart
          chartType="PieChart"
          data={toList(lanTest[suburb])}
          width="300px"
          height="250px"
          options={options}
          legendToggle
        />
      ))}
    </div>
  );
}

export default Senerio2;