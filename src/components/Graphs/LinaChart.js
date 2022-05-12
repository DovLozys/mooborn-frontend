import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart() {
  const [chartData, setChartData] = useState({});

  async function fetchSleep() {
    const res = await fetch("https://api.coincap.io/v2/assets/?limit=5");
    const data = res.json();
  }
  const data = fetchSleep();
  return (
    <div>
      <h1>Hello!</h1>
      <h3>{data}</h3>
    </div>
  );
}

export default LineChart;
