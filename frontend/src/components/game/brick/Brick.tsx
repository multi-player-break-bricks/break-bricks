import { BRICK_SIZE } from "@/constants";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import React from "react";

type Props = { xPos: number; yPos: number; id: number; level: number };

export const Brick = ({ xPos, yPos, level }: Props) => {
  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;
  const opacity = (level - 1) * 0.12 + 0.4;

  return (
    <svg
      style={{
        left: `${xPos * displayRatio}px`,
        top: `${yPos * displayRatio}px`,
        width: `${BRICK_SIZE * displayRatio}px`,
        height: `${BRICK_SIZE * displayRatio}px`,
        opacity: opacity,
      }}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="150" height="150" fill="#5A1757" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0H20V20H0V0ZM35 35H115V115H35V35ZM150 130H130V150H150V130Z"
        fill="#8C4A89"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M110 10H140V20V50H130V20H110V10ZM20 130V100H10V130V140H40V130H20ZM60 140H50V130H60V140ZM100 10H90V20H100V10Z"
        fill="#FAD2F8"
      />
    </svg>
  );
};
