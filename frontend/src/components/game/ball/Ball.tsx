import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

export const Ball = ({ xPos, yPos, size }: Ball) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <svg
      style={{
        position: "absolute",
        left: `${(xPos - size) * displayRatio}px`,
        top: `${(yPos - size) * displayRatio}px`,
        width: `${size * 2 * displayRatio}px`,
        height: `${size * 2 * displayRatio}px`,
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
          <stop offset="0.0833333" stopColor="#757575" />
          <stop offset="1" />
        </radialGradient>
      </defs>
    </svg>
  );
};
