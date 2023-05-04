import { useSocketContext } from "@/contexts/socketContext";
import { Player } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

//test data
let rectWidth = 50;
let rectHeight = 50;

const Canvas = () => {
  //init canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { socket } = useSocketContext();
  const [players, setPlayers] = useState<Player[]>([]);

  const router = useRouter();

  let canvas = canvasRef.current;
  canvas?.style.setProperty("width", "500px");
  canvas?.style.setProperty("height", "500px");
  let context = canvas?.getContext("2d");

  useEffect(() => {
    canvas = canvasRef.current;
    canvas?.style.setProperty("width", "500px");
    canvas?.style.setProperty("height", "500px");
    context = canvas?.getContext("2d");

    //event listeners
    window.addEventListener("keydown", (event) => {
      console.log("key pressed: " + event.key);
      if (event.key === "ArrowLeft") {
        rectWidth -= 1;
      }
      if (event.key === "ArrowRight") {
        rectWidth += 1;
      }
      if (event.key === "ArrowUp") {
        rectHeight -= 1;
      }
      if (event.key === "ArrowDown") {
        rectHeight += 1;
      }
    });

    window.addEventListener("keyup", (event) => {
      console.log("key released: " + event.key);
    });
  }, []);

  setInterval(() => {
    DrawOnCanvas(canvas?.getContext("2d"));
  }, 100);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};

function DrawOnCanvas(canvasctx: CanvasRenderingContext2D | null | undefined) {
  if (canvasctx === null || canvasctx === undefined) {
    return;
  }
  canvasctx.clearRect(0, 0, 500, 500);
  canvasctx.fillStyle = "green";
  canvasctx.fillRect(0, 0, rectWidth, rectHeight);
}

export default Canvas;
