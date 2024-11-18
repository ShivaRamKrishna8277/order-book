"use client";
import styles from "../styles.module.css";

// Main interface for the order book data
export interface OrderBookData {
  lastUpdateId: number;
  ltp: number | null;
  bids: string[];
  asks: string[];
  prevPrice: number | null;
}

export default function Orderbook({
  ltp,
  bids,
  asks,
  prevPrice,
}: OrderBookData) {
  let bidTotal = 0;
  let askTotal = 0;

  return (
    <div className={`${styles.backgroundColor} p-3 px-5 my-4 rounded`}>
      <p className={styles.sectionTitle}>Order Book</p>
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Bids Table */}
        <table
          className={`text-sm w-[100%] md:w-[38%] ${styles.orderBookTable}`}
        >
          <thead>
            <tr>
              <th className="font-light text-start pb-2">Price(USDT)</th>
              <th className="font-light text-start pb-2">Quantity</th>
              <th className="font-light text-start pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => {
              const price = parseFloat(bid[0]); // Access the price (first item in the pair)
              const quantity = parseFloat(bid[1]); // Access the quantity (second item in the pair)

              // Check if price and quantity are valid
              if (isNaN(price) || isNaN(quantity)) {
                return null; // Skip invalid data
              }

              const total = price * quantity;
              bidTotal += total;

              return (
                <tr key={index}>
                  <td
                    className={`${styles.greenColor} ${styles.cellStyles} w-1/3`}
                  >
                    {price.toFixed(2)}
                  </td>
                  <td className={` ${styles.cellStyles} w-1/3`}>
                    {quantity.toFixed(4)}
                  </td>
                  <td className={` ${styles.cellStyles} w-1/3`}>
                    {bidTotal.toFixed(2)} {/* Display bid total */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Last Traded Price Display */}
        <div className="currentPriceOB md:w-[20%] w-[100%] my-5 md:my-0 bg-[#202229] py-3 rounded text-center">
          <p className="text-xs opacity-50 mb-1">Last Traded Price</p>
          <h1
            className={`text-xl ${
              ltp !== null && prevPrice !== null
                ? ltp > prevPrice
                  ? "text-[#73FF00]" // Green for increase
                  : ltp < prevPrice
                  ? "text-[#ff0000]" // Red for decrease
                  : "text-white" // White for no change
                : ""
            } text-3xl font-semibold`}
          >
            {ltp}
          </h1>
        </div>

        {/* Asks Table */}
        <table
          className={`text-sm w-[100%] md:w-[38%] ${styles.orderBookTable}`}
        >
          <thead>
            <tr>
              <th className="font-light text-start pb-2">Price(USDT)</th>
              <th className="font-light text-start pb-2">Quantity</th>
              <th className="font-light text-start pb-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {asks.map((ask, index) => {
              const price = parseFloat(ask[0]); // Access the price (first item in the pair)
              const quantity = parseFloat(ask[1]); // Access the quantity (second item in the pair)

              // Check if price and quantity are valid
              if (isNaN(price) || isNaN(quantity)) {
                return null; // Skip invalid data
              }

              const total = price * quantity;
              askTotal += total;

              return (
                <tr key={index}>
                  <td
                    className={`${styles.redColor} ${styles.cellStyles} w-1/3`}
                  >
                    {price.toFixed(2)}
                  </td>
                  <td className={` ${styles.cellStyles} w-1/3`}>
                    {quantity.toFixed(4)}
                  </td>
                  <td className={` ${styles.cellStyles} w-1/3`}>
                    {askTotal.toFixed(2)} {/* Display ask total */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
