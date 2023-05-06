import { useSocketContext } from "@/contexts/socketContext";
import { useCanvas } from "@/hooks/useCanvas";
// import { Bouncer, GameObject, Player } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { initialBall, initialBouncers, initialBricks } from "./seeds";
import styles from "./index.module.css";
import { Brick } from "../brick/Brick";
import { Bouncer } from "../bouncer/Bouncer";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { Ball } from "../ball/Ball";

const Canvas = ({}) => {
  //init canvas
  // const { canvasRef, drawRect, drawOnCanvas } = useCanvas();

  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { socket } = useSocketContext();

  const [bouncers, setBouncers] = useState<Bouncer[]>(initialBouncers);
  const [ball, setBall] = useState<GameObject>(initialBall);
  const [bricks, setBricks] = useState<Brick[]>(initialBricks);

  const playerId = 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas?.style.setProperty("width", `${canvasSize}px`);
    canvas?.style.setProperty("height", `${canvasSize}px`);
    if (playerId) {
      canvas?.style.setProperty("transform", "rotate(90deg)");
    }
  }, [canvasRef, canvasSize]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        socket?.emit("move-bouncer", { direction: "left", pressed: true });
      }
      if (event.key === "ArrowRight") {
        socket?.emit("move-bouncer", { direction: "right", pressed: true });
      }
    };

    const onKeyup = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        socket?.emit("move-bouncer", { direction: "left", pressed: false });
      }
      if (event.key === "ArrowRight") {
        socket?.emit("move-bouncer", { direction: "right", pressed: false });
      }
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, [ball, bouncers, bricks, socket]);

  // useEffect(() => {
  //   socket?.on("frame-change", ({ bouncers, ball }) => {
  //     console.log({ bouncers, ball });
  //     setBall(ball);
  //     setBouncers(bouncers);
  //     drawOnCanvas({ bouncers, ball, bricks });
  //   });

  //   return () => {
  //     socket?.off("frame-change");
  //   };
  // }, [bricks, drawOnCanvas, socket]);

  // useEffect(() => {
  //   socket?.on("brick-destroyed", (brick) => {
  //     const newBricks = bricks
  //       .map((b) => {
  //         if (b.id === brick.id) {
  //           return { ...b, level: b.level - 1 };
  //         }
  //         return b;
  //       })
  //       .filter((b) => b.level > 0);
  //     setBricks(newBricks);
  //     drawOnCanvas({ bouncers, ball, bricks });
  //   });
  // }, [ball, bouncers, bricks, drawOnCanvas, socket]);

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {bricks.map((brick) => (
        <Brick key={brick.id} {...brick} />
      ))}
      {bouncers.map((bouncer) => (
        <Bouncer key={bouncer.id} {...bouncer} />
      ))}
      <Ball {...ball} />
    </div>
  );
};

export default Canvas;
