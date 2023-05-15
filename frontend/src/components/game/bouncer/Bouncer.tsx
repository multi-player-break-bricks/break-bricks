import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  loveNFTContract,
  electricNFTContract,
} from "@/components/BlockChain/NFts";

export const Bouncer = ({ xPos, yPos, height, width, number }: Bouncer) => {
  const [useSkinName] = useLocalStorage("useSkin");
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  const rotation = number * 90;

  const normalBouncer: any = () => {
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
  };

  const loveBouncer: any = () => {
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
  };

  const electricBouncer: any = () => {
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
            id="svg_1"
            fill="#B3FEE3"
            d="m0,0l400,0l-15,15l-370,0l-15,-15z"
          />
          <path
            id="svg_2"
            fill="#117954"
            d="m385,15l15,-15l0,80l-400,0l15,-15l370,0l0,-50z"
          />
          <path
            id="svg_3"
            d="m212.63859,20.90678l7.72125,11.54082l-3.18378,1.362l9.72252,9.88796l-3.18236,1.65133l12.01907,16.5579l-20.38648,-12.6889l3.88844,-1.76213l-12.66667,-8.12736l4.53889,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_5"
            d="m270.14091,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_7"
            d="m238.68137,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_8"
            d="m299.20596,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_9"
            d="m329.27255,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_10"
            d="m358.28979,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_17"
            d="m34.99536,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_18"
            d="m96.06909,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_19"
            d="m64.60955,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_20"
            d="m125.13414,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_21"
            d="m155.20073,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
          <path
            id="svg_22"
            d="m184.21797,20.90678l7.72125,11.54082l-3.18379,1.362l9.72253,9.88795l-3.18236,1.65133l12.01907,16.5579l-20.38649,-12.6889l3.88844,-1.76213l-12.66666,-8.12736l4.53888,-2.51162l-13.37417,-8.52596l14.9033,-7.38403z"
            stroke="#000000"
            fill="#ff0000"
          />
        </g>
      </svg>
    );
  };

  if (useSkinName === loveNFTContract.skinName) {
    return loveBouncer();
  } else if (useSkinName === electricNFTContract.skinName) {
    return electricBouncer();
  } else {
    return normalBouncer();
  }
};
