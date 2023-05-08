import { BOUNCER_HEIGHT, BOUNCER_WIDTH } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; number: number; id: string };

export const Bouncer = ({ xPos, yPos, number }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  const rotation = number * 90;

  return (
    <svg
      style={{
        backgroundColor: "blue",
        left: `${
          xPos * displayRatio -
          ((number + 1) % 2) *
            (((BOUNCER_WIDTH - BOUNCER_HEIGHT) / 2) * displayRatio)
        }px`,
        top: `${yPos * displayRatio}px`,
        width: `${BOUNCER_WIDTH * displayRatio}px`,
        height: `${BOUNCER_HEIGHT * displayRatio}px`,
        transform: `rotate(${number % 2 === 0 ? 90 : 0}deg)`,
        filter: `hue-rotate(${rotation}deg)`,
      }}
      viewBox="0 0 400 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="80" fill="#23D796" />
      <path d="M0 0H400L385 15H15L0 0Z" fill="#B3FEE3" />
      <path d="M385 15L400 0V80H0L15 65H385V15Z" fill="#117954" />
    </svg>
  );
};
