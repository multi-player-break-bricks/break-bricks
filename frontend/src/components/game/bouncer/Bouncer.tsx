import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = {
  xPos: number;
  yPos: number;
  height: number;
  width: number;
  number: number;
  id: number;
};

export const Bouncer = ({ xPos, yPos, height, width, number }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  const rotation = number * 90;

  return (
    <svg
      style={{
        backgroundColor: "blue",
        borderRadius: "2px",
        left: `${
          xPos * displayRatio +
          ((number + 1) % 2) * (((width - height) / 2) * displayRatio)
        }px`,
        top: `${yPos * displayRatio}px`,
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
