import { BALL_SIZE, BRICK_SIZE } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number };

export const Ball = ({ xPos, yPos }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <div
      style={{
        backgroundColor: "black",
        borderRadius: "50%",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${BALL_SIZE * displayRatio}px`,
        height: `${BALL_SIZE * displayRatio}px`,
      }}
    ></div>
  );
};
