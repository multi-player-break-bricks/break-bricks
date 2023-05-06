import { BOUNCER_HEIGHT, BOUNCER_WIDTH } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; number: number; id: string };

export const Bouncer = ({ xPos, yPos, number }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  return (
    <svg
      style={{
        backgroundColor: "blue",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${
          (number % 2 === 0 ? BOUNCER_HEIGHT : BOUNCER_WIDTH) * displayRatio
        }px`,
        height: `${
          (number % 2 === 0 ? BOUNCER_WIDTH : BOUNCER_HEIGHT) * displayRatio
        }px`,
      }}
      viewBox="0 0 451 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.180542" width="450" height="80" fill="#23D796" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 0H0V5H5V10H10H440V5H445V0H440H10ZM10 25V20V15H60V20H25V25H10ZM70 15H65V20H70V15ZM430 50H435V65H430V50Z"
        fill="#B3FEE3"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M445.181 0H450.181V80H445.181H440.181H435.181H10.1805H0.180542V75H5.18054V70H10V65H15V70H430.181V65H435.181V10H440.181V5H445.181V0Z"
        fill="#117954"
      />
    </svg>
  );
};
