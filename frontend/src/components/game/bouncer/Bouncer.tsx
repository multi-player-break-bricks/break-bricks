import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";
import login from "./../../BlockChain/block_chain_login";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const Bouncer = ({ xPos, yPos, height, width, number }: Bouncer) => {
  const [loggedIn, setloggedIn] = useLocalStorage("loggedIn");
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  const rotation = number * 90;

  if (loggedIn === "false") {
    return (
      <svg
        style={{
          backgroundColor: "blue",
          borderRadius: "2px",
          left: `${
            xPos * displayRatio +
            ((number + 1) % 2) * (((width - height) / 2) * displayRatio)
          }px`,
          top: `${
            yPos * displayRatio -
            ((number + 1) % 2) * (((width - height) / 2) * displayRatio)
          }px`,
          width: `${(number % 2 ? width : height) * displayRatio}px`,
          height: `${(number % 2 ? height : width) * displayRatio}px`,
          transform: `rotate(${number % 2 === 0 ? 90 : 0}deg)`,
          filter: `hue-rotate(${rotation}deg)`,
        }}
        preserveAspectRatio="none"
        viewBox="0 0 400 80"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0H400L385 15H15L0 0Z" fill="#B3FEE3" />
        <path d="M385 15L400 0V80H0L15 65H385V15Z" fill="#117954" />
      </svg>
    );
  } else {
    return (
      <svg
        style={{
          backgroundColor: "blue",
          borderRadius: "2px",
          left: `${
            xPos * displayRatio +
            ((number + 1) % 2) * (((width - height) / 2) * displayRatio)
          }px`,
          top: `${
            yPos * displayRatio -
            ((number + 1) % 2) * (((width - height) / 2) * displayRatio)
          }px`,
          width: `${(number % 2 ? width : height) * displayRatio}px`,
          height: `${(number % 2 ? height : width) * displayRatio}px`,
          transform: `rotate(${number % 2 === 0 ? 90 : 0}deg)`,
          filter: `hue-rotate(${rotation}deg)`,
        }}
        viewBox="0 0 400 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <g>
          <title>Layer 1</title>
          <path
            d="m0,0l400,0l-15,15l-370,0l-15,-15z"
            fill="#B3FEE3"
            id="svg_1"
          />
          <path
            d="m385,15l15,-15l0,80l-400,0l15,-15l370,0l0,-50z"
            fill="#117954"
            id="svg_2"
          />
          <path
            stroke="#000000"
            fill="#ff0000"
            d="m200,27.84932c8.81476,-27.66611 43.35127,0 0,35.57071c-43.35127,-35.57071 -8.81476,-63.23682 0,-35.57071z"
            id="svg_5"
          />
        </g>
      </svg>
    );
  }
};
