import { useCallback, useEffect, useRef } from "react";

type GameObjects = {
  bouncers: Bouncer[];
  ball: GameObject;
  bricks: Brick[];
};

export const useCanvas = () => {
  const bouncerWidth = 50;
  const bouncerHeight = 10;
  const brickWidth = 25;
  const ballSize = 10;

  const canvasWidth = 400;
  const displayRatio = canvasWidth / 500;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    console.log("setting up canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasWidth;
    canvas?.style.setProperty("width", `${canvasWidth}px`);
    canvas?.style.setProperty("height", `${canvasWidth}px`);
  }, [canvasRef, canvasWidth]);

  const drawRect = useCallback(
    (x: number, y: number, width: number, height: number, color: string) => {
      const canvasContext = canvasRef.current?.getContext("2d");
      if (!canvasContext) throw new Error("canvas is null");
      canvasContext.fillStyle = color;
      console.log({ x, y, width, height });
      canvasContext.fillRect(
        x * displayRatio,
        y * displayRatio,
        width * displayRatio,
        height * displayRatio
      );
    },
    [displayRatio, canvasRef]
  );

  const clear = useCallback(() => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (!canvasContext) throw new Error("canvas is null");
    canvasContext.clearRect(0, 0, canvasWidth, canvasWidth);
  }, [canvasWidth, canvasRef]);

  const drawOnCanvas = useCallback(
    ({ bouncers, bricks, ball }: GameObjects) => {
      clear();
      console.log({ bouncers });
      bouncers.forEach(({ id, xPos, yPos }) => {
        if (id === "1" || id === "3") {
          drawRect(xPos, yPos, bouncerWidth, bouncerHeight, "green");
        } else {
          drawRect(xPos, yPos, bouncerHeight, bouncerWidth, "blue");
        }
      });
      bricks.forEach(({ xPos, yPos, level }) => {
        drawRect(xPos, yPos, brickWidth, brickWidth, "red");
      });
      const { xPos, yPos } = ball;
      drawRect(xPos, yPos, ballSize, ballSize, "red");
    },
    [clear, drawRect]
  );

  return {
    canvasRef,
    drawRect,
    drawOnCanvas,
  };
};
