import { BOUNCER_HEIGHT, BOUNCER_WIDTH } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; number: number; id: string };

export const Bouncer = ({ xPos, yPos, number }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  return (
    <div
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
      }}
    ></div>
  );
};
