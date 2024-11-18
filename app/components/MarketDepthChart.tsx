"use client";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styles from "../styles.module.css";
import { useState } from "react";

export default function MarketDepthChart() {
  const [bidData, setBidData] = useState();
  const [askData, setAskData] = useState();
  const ws = new WebSocket(
    "wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms"
  );
  let lastProcessedTime = 0;

  ws.onmessage = (event: any) => {
    const now = Date.now();
    if (now - lastProcessedTime >= 1000) {
      const data = JSON.parse(event.data);
      const bids = data.bids.map(([price, quantity]: string[]) => [
        parseFloat(price),
        parseFloat(quantity),
      ]);
      setBidData(bids);
      const asks = data.asks.map(([price, quantity]: string[]) => [
        parseFloat(price),
        parseFloat(quantity),
      ]);
      setAskData(asks);
    }
  };
  const options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      type: "area",
      zooming: {
        type: "xy",
      },
      backgroundColor: "transparent",
    },
    title: {
      text: "",
      style: {
        color: "#ffffff",
      },
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      plotLines: [
        {
          color: "#888",
          value: 0.1523,
          width: 1,
          label: {
            text: "Actual price",
            rotation: 90,
            style: {
              color: "#ffffff",
            },
          },
        },
      ],
      title: {
        text: "Price",
        style: {
          color: "#ffffff",
        },
      },
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    yAxis: [
      {
        lineWidth: 1,
        gridLineWidth: 0, // Hides the horizontal grid lines
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: "inside",
        labels: {
          align: "left",
          x: 8,
          style: {
            color: "#ffffff",
          },
        },
      },
      {
        opposite: true,
        linkedTo: 0,
        lineWidth: 1,
        gridLineWidth: 0, // Hides the horizontal grid lines for the opposite y-axis as well
        title: null,
        tickWidth: 1,
        tickLength: 5,
        tickPosition: "inside",
        labels: {
          align: "right",
          x: -8,
          style: {
            color: "#ffffff",
          },
        },
      },
    ],
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillOpacity: 0.4,
        lineWidth: 1,
        step: "center",
      },
    },
    tooltip: {
      headerFormat:
        '<span style="font-size=10px; color: #000000;">Price: {point.key}</span><br/>',
      valueDecimals: 2,
    },
    series: [
      {
        name: "Bids",
        data: bidData,
        color: "#73FF00",
      },
      {
        name: "Asks",
        data: askData,
        color: "#ff0000",
      },
    ],
  };
  return (
    <div className={`${styles.backgroundColor} p-3 px-5 my-4 rounded`}>
      <p className={styles.sectionTitle}>Market Depth</p>
      <div id="DepthChart-container">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}
