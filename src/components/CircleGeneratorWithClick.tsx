import React from "react";
import PropTypes from "prop-types";
interface ICircleGeneratorWithClick {
  data: number[];
  selectedDataIndicies: number[];
  handleClick: Function;
}

const CircleGeneratorWithClick = ({
  data,
  selectedDataIndicies,
  handleClick,
}: ICircleGeneratorWithClick) => {
  return (
    <svg width="720" height="120">
      {data.map((o, i) => {
        const isDataSelected = selectedDataIndicies.includes(i);
        return (
          <circle
            onClick={(event) => {
              console.log(
                "if you needed access to the event to pass something to the handler, here it is!",
                event
              );
              return handleClick(i);
            }}
            key={i}
            cx={i * 100 + 30}
            cy="60"
            r={Math.sqrt(o)}
            style={{ fill: isDataSelected ? "pink" : "steelblue" }}
          />
        );
      })}
    </svg>
  );
};

export default CircleGeneratorWithClick;
