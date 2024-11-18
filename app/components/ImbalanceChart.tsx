"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles.module.css";

interface props {
  bidQuantity: number;
  askQuantity: number;
}

export default function ImbalanceChart({ bidQuantity, askQuantity }: props) {
  const totalQuantity = bidQuantity + askQuantity;

  // to calculate bid and ask bar width's
  const bidWidthPercent = (bidQuantity / totalQuantity) * 100;
  const askWidthPercent = 100 - bidWidthPercent;

  return (
    <div className={`${styles.backgroundColor} p-3 px-5 my-4 rounded`}>
      <p className={styles.sectionTitle}>Order Book Imbalance</p>
      <div className="flex text-[11px] items-center justify-between w-100 mb-1">
        <p className="text-[#73ff00]">Bid - {bidWidthPercent.toFixed(2)}</p>
        <p className="text-[#ff0000]">{askWidthPercent.toFixed(2)} - Ask</p>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "30px",
        }}
        className="rounded overflow-hidden mb-2"
      >
        <div
          style={{
            width: `${bidWidthPercent}%`,
            backgroundColor: "#73ff00",
            height: "100%",
            transition: "width 0.5s",
          }}
        />
        <div
          style={{
            width: `${askWidthPercent}%`,
            backgroundColor: "#ff0000",
            height: "100%",
            transition: "width 0.5s",
          }}
        />
      </div>
    </div>
  );
}
