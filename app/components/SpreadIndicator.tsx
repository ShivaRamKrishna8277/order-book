"use client";
import { useEffect } from "react";
import styles from "../styles.module.css";
import { createChart } from "lightweight-charts";

interface SpreadIndicatorProps {
  spreadHistory: { time: number; value: number }[];
}

export default function SpreadIndicator({
  spreadHistory,
}: SpreadIndicatorProps) {
  useEffect(() => {
    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) {
      const chart = createChart(chartContainer, {
        height: 300,
        layout: {
          background: {
            color: "transparent",
          },
          textColor: "white",
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
      });

      const areaSeries = chart.addAreaSeries({
        topColor: "#73FF00",
        bottomColor: "rgba(0, 255, 0, 0.1)",
        lineColor: "rgb(0, 255, 0)",
      });

      areaSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      });

      chart.timeScale().fitContent();
      chart.timeScale().applyOptions({
        timeVisible: true,
        secondsVisible: true,
      });

      // chart data
      areaSeries.setData(
        spreadHistory.map(({ time, value }) => ({ time, value }))
      );

      return () => {
        chart.remove();
      };
    }
  }, [spreadHistory]);

  return (
    <div className={`${styles.backgroundColor} p-3 px-5 my-4 rounded`}>
      <p className={styles.sectionTitle}>Spread Indicator</p>
      <div
        id="chart-container"
        style={{ width: "100%", height: "300px" }}
      ></div>
    </div>
  );
}
