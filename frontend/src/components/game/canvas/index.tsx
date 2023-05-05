import { useSocketContext } from "@/contexts/socketContext";
import { useCanvas } from "@/hooks/useCanvas";
import { Brick, GameObject, Player } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { initialBall, initialBouncers, initialBricks } from "./seeds";
import styles from "./index.module.css";

const Canvas = ({}) => {
  //init canvas
  const { canvasRef, drawRect, drawOnCanvas } = useCanvas();

  const { socket } = useSocketContext();

  const [bouncers, setBouncers] =
    useState<Record<string, GameObject>>(initialBouncers);
  const [ball, setBall] = useState<GameObject>(initialBall);
  const [bricks, setBricks] = useState<Brick[]>(initialBricks);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      console.log("key pressed: " + event.key);
      if (event.key === "ArrowLeft") {
        drawOnCanvas({ bouncers, ball, bricks });
      }
    };

    const onKeyup = (event: KeyboardEvent) => {
      console.log("key released: " + event.key);
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, [ball, bouncers, bricks, drawOnCanvas, drawRect]);

  // useEffect(() => {
  //   socket?.on("game-info", (data) => {
  //     console.log(data);
  //   });

  //   return () => {
  //     socket?.off("game-info");
  //   };
  // }, [socket]);

  return (
    <div>
      <canvas className={styles.canvas} ref={canvasRef} />
    </div>
  );
};

export default Canvas;
