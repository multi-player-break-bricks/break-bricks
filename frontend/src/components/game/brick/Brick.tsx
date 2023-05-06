import { BRICK_SIZE } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; id: string; level: number };

export const Brick = ({ xPos, yPos, level }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  return (
    <svg
      style={{
        backgroundColor: "tomato",
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${BRICK_SIZE * displayRatio}px`,
        height: `${BRICK_SIZE * displayRatio}px`,
      }}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="150" height="150" fill="#5A1757" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M140 10H105V15H135V40H140V15V10ZM135 45H140V50H135V45ZM10 140H45V135H15V110H10V135V140ZM10 105H15V100H10V105Z"
        fill="#FAD2F8"
      />
    </svg>
  );
};
