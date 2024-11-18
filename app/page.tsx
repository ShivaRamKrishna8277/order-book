"use client";
import Head from "next/head";
import styles from "./styles.module.css";
import Orderbook from "./components/Orderbook";
import SpreadIndicator from "./components/SpreadIndicator";
import ImbalanceChart from "./components/ImbalanceChart";
import MarketDepthChart from "./components/MarketDepthChart";
import { useEffect, useState } from "react";

// Define the main interface for the order book data
export interface OrderBookData {
  lastUpdateId: number;
  bids: string[];
  asks: string[];
}

export default function Home() {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [change24h, setChange24h] = useState<number | null>(null);
  const [high24h, setHigh24h] = useState<number | null>(null);
  const [low24h, setLow24h] = useState<number | null>(null);
  const [decimals, setDecimals] = useState<number>(2);
  const [orderBookData, setOrderBookData] = useState<OrderBookData | null>(
    null
  );
  const [spreadHistory, setSpreadHistory] = useState<
    { time: number; value: number }[]
  >([]);
  const [bidQuantity, setBidQuantity] = useState<number | null>(null);
  const [askQuantity, setAskQuantity] = useState<number | null>(null);

  useEffect(() => {
    let lastProcessedTime = 0;

    // Establishing Web Sockets Connection
    let ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    let wsOrderBook = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@depth10@100ms"
    );

    ws.onmessage = (event) => {
      const now = Date.now();
      if (now - lastProcessedTime >= 1000) {
        const stockObject = JSON.parse(event.data);
        if (stockObject.p) {
          setPrice((prev) => {
            setPrevPrice(prev);
            return parseFloat(stockObject.p);
          });
        }
        setDecimals(stockObject.p > 0 && stockObject.p < 1 ? 4 : 2);
      }
    };

    // webSocket message handler for order book data
    wsOrderBook.onmessage = (event) => {
      const now = Date.now();
      if (now - lastProcessedTime >= 1000) {
        lastProcessedTime = now;
        const data = JSON.parse(event.data);

        // Process Order Book Data
        setOrderBookData({
          lastUpdateId: data.lastUpdateId,
          bids: data.bids,
          asks: data.asks,
        });

        if (data.bids.length > 0 && data.asks.length > 0) {
          const highestBid = Math.max(
            ...data.bids.map((bid: string[]) => parseFloat(bid[0]))
          );
          const lowestAsk = Math.min(
            ...data.asks.map((ask: string[]) => parseFloat(ask[0]))
          );
          const spreadValue = lowestAsk - highestBid;
          const currentTime = Math.floor(Date.now() / 1000);

          setSpreadHistory((prevHistory) => {
            const updatedHistory = [
              ...prevHistory,
              { time: currentTime, value: spreadValue },
            ];
            if (updatedHistory.length > 60) {
              updatedHistory.shift(); // Remove the oldest entry
            }
            return updatedHistory;
          });

          let totalBid = 0;
          data.bids.forEach((bid: string[]) => {
            totalBid += parseFloat(bid[1]);
          });
          setBidQuantity(totalBid);

          let totalAsk = 0;
          data.asks.forEach((ask: string[]) => {
            totalAsk += parseFloat(ask[1]);
          });
          setAskQuantity(totalAsk);
        }
      }
    };

    // webSocket message handler for coin general data
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
        );
        const data = await response.json();
        setChange24h(parseFloat(data.priceChange));
        setHigh24h(parseFloat(data.highPrice));
        setLow24h(parseFloat(data.lowPrice));
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();

    return () => {
      ws.close();
      wsOrderBook.close();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Crypto Book</title>
        <meta
          name="description"
          content="Live BTC-USD Orderbook and Market Indicators"
        />
      </Head>
      <main>
        {/* Nav Bar */}
        <nav className={`px-3 ${styles.backgroundColor} text-center`}>
          <h1 className={styles.logoFont}>
            ORDER <span className={styles.brandColor}>BOOK</span>
          </h1>
        </nav>

        <div className="max-w-[1000px] mx-auto py-5 px-3">
          {/* General Details */}
          <div className={`assetDetail ${styles.backgroundColor} rounded p-3`}>
            <ul className="flex flex-col md:flex-row md:items-center md:gap-8 gap-3">
              <li>
                <h1 className={`${styles.brandColor} text-3xl font-bold`}>
                  BTCUSDT
                </h1>
              </li>
              <li>
                <p className="opacity-50 text-[9px]">Current Price</p>
                <h1
                  className={`text-xl ${
                    price !== null && prevPrice !== null
                      ? price > prevPrice
                        ? "text-[#73FF00]" // Green for increase
                        : price < prevPrice
                        ? "text-[#ff0000]" // Red for decrease
                        : "text-white" // White for no change
                      : ""
                  }`}
                >
                  {price !== null ? price.toFixed(decimals) : "Loading..."}
                </h1>
              </li>
              <li>
                <p className="opacity-50 text-[9px]">24H Change</p>
                <h1
                  className={`text-xl ${
                    change24h !== null
                      ? change24h > 0
                        ? "text-[#73FF00]"
                        : change24h < 0
                        ? "text-[#ff0000]"
                        : "text-white"
                      : ""
                  }`}
                >
                  {change24h !== null
                    ? change24h.toFixed(decimals)
                    : "Loading..."}
                </h1>
              </li>
              <li>
                <p className="opacity-50 text-[9px]">24H High</p>
                <h1 className="text-xl">
                  {high24h !== null ? high24h.toFixed(decimals) : "Loading..."}
                </h1>
              </li>
              <li>
                <p className="opacity-50 text-[9px]">24H Low</p>
                <h1 className="text-xl">
                  {low24h !== null ? low24h.toFixed(decimals) : "Loading..."}
                </h1>
              </li>
            </ul>
          </div>
          {/* General Details End */}

          {/* Orderbook Component */}
          {orderBookData ? (
            <Orderbook
              ltp={price}
              lastUpdateId={orderBookData.lastUpdateId}
              bids={orderBookData.bids}
              asks={orderBookData.asks}
              prevPrice={prevPrice}
            />
          ) : (
            <div
              className={`w-full p-3 text-center ${styles.backgroundColor} rounded mt-5`}
            >
              Loading Order Book...
            </div>
          )}

          {/* Spread Indicator Components */}
          {spreadHistory.length > 0 ? (
            <SpreadIndicator spreadHistory={spreadHistory} />
          ) : (
            <div
              className={`w-full p-3 text-center ${styles.backgroundColor} rounded mt-5`}
            >
              Loading Spread Indicator...
            </div>
          )}

          {/* Imbalace Chart Component */}
          {bidQuantity !== null && askQuantity !== null ? (
            <ImbalanceChart
              bidQuantity={bidQuantity}
              askQuantity={askQuantity}
            />
          ) : (
            <div
              className={`w-full p-3 text-center ${styles.backgroundColor} rounded mt-5`}
            >
              Loading Imbalance Indicator...
            </div>
          )}

          {/* Market Depth Chart Component */}
          <MarketDepthChart />
        </div>
      </main>
    </div>
  );
}
