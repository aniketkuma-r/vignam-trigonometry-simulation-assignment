import React from "react";
import { calculateAngle, calculateDistance } from "../utils/angleCalc.ts";

export default function ConnectorLine({ start, end }) {
  const lineLength = calculateDistance(start.x, start.y, end.x, end.y);
  const lineAngle = calculateAngle(start.x, start.y, end.x, end.y);

  return (
    <div
      className="absolute border-dashed border-2 border-gray-600"
      style={{
        width: lineLength,
        top: start.y,
        left: start.x,
        transform: `rotate(${lineAngle}deg)`,
        transformOrigin: "0% 0%",
      }}
    />
  );
}
