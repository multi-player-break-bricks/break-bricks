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
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${
          (number % 2 === 0 ? BOUNCER_HEIGHT : BOUNCER_WIDTH) * displayRatio
        }px`,
        height: `${
          (number % 2 === 0 ? BOUNCER_WIDTH : BOUNCER_HEIGHT) * displayRatio
        }px`,
      }}
    ></div>
  );
};
