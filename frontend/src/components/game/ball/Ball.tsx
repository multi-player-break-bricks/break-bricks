import { BALL_SIZE, BRICK_SIZE } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number };

export const Ball = ({ xPos, yPos }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <svg
      style={{
        backgroundColor: "black",
        borderRadius: "50%",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${BALL_SIZE * displayRatio}px`,
        height: `${BALL_SIZE * displayRatio}px`,
      }}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="25" fill="url(#paint0_radial_48_348)" />
      <defs>
        <radialGradient
          id="paint0_radial_48_348"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(25 25) rotate(90) scale(25)"
        >
          <stop offset="0.0833333" stop-color="#757575" />
          <stop offset="1" />
        </radialGradient>
      </defs>
    </svg>
  );
};
