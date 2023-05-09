import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

export const Wall = ({ xPos, yPos, height, width }: Wall) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <div
      style={{
        backgroundColor: "darkred",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${width * displayRatio}px`,
        height: `${height * displayRatio}px`,
      }}
    ></div>
  );
};
