import { BRICK_SIZE } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; id: string; level: number };

export const Brick = ({ xPos, yPos, level }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <div
      style={{
        backgroundColor: "tomato",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${BRICK_SIZE * displayRatio}px`,
        height: `${BRICK_SIZE * displayRatio}px`,
      }}
    ></div>
  );
};
