import React from "react";

const CircleGenerator = ({ data }) => {
  return (
    <svg width="720" height="120">
      {data.map((o, i) => (
        <circle
          key={i}
          cx={i * 100 + 30}
          cy="60"
          r={Math.sqrt(o)}
          style={{ fill: "steelblue" }}
        />
      ))}
    </svg>
  );
};

export default CircleGenerator;
