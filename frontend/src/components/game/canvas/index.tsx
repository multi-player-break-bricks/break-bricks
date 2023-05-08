import { useSocketContext } from "@/contexts/socketContext";
import { useCanvas } from "@/hooks/useCanvas";
// import { Bouncer, GameObject, Player } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { initialBalls, initialBouncers, initialBricks } from "./seeds";
import styles from "./index.module.css";
import { Brick } from "../brick/Brick";
import { Bouncer } from "../bouncer/Bouncer";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { Ball } from "../ball/Ball";
import { Reward } from "../reward/Reward";

const Canvas = () => {
  //init canvas
  // const { canvasRef, drawRect, drawOnCanvas } = useCanvas();

  const canvasSize = useCanvasSize();
  const displayRatio = canvasSize / 500;

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { socket } = useSocketContext();

  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  const [bouncers, setBouncers] = useState<Bouncer[]>(initialBouncers);
  const [balls, setBalls] = useState<GameObject[]>(initialBalls);
  const [bricks, setBricks] = useState<Brick[]>(initialBricks);
  const [rewards, setRewards] = useState<Reward[]>([]);

  const playerId = 0;

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas?.style.setProperty("width", `${canvasSize}px`);
    canvas?.style.setProperty("height", `${canvasSize}px`);
    // if (playerId) {
    //   canvas?.style.setProperty("transform", "rotate(90deg)");
    // }
  }, [canvasRef, canvasSize]);

  useEffect(() => {
    socket?.on("join-room-success", (room) => {
      console.log(room);
      const { gameInfo, id } = room;
      setRoomId(id);
      setPlayers(room.players);
      setBouncers(gameInfo.bouncers);
      setBalls(gameInfo.balls);
      setBricks(gameInfo.bricks);
      setInterval(() => {
        socket.emit("request-game-info", room.id);
      }, 1000 / 16);
    });

    return () => {
      socket?.off("join-room-success");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("frame-change", ({ bouncers, balls, bricks, rewards }) => {
      console.log({ bouncers, balls, bricks });
      setBouncers(bouncers);
      setBalls(balls);
      setBricks(bricks);
      setRewards(rewards);
    });

    return () => {
      socket?.off("frame-change");
    };
  }, [socket]);

  const emitMoveBouncer = useCallback(
    (direction: "left" | "right", pressed: boolean) => {
      const player = players.find((p) => p.id === socket?.id);
      socket?.emit("move-bouncer", {
        direction,
        pressed,
        roomId,
        playerNumber: player?.number,
      });
    },
    [players, roomId, socket]
  );

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") emitMoveBouncer("left", true);
      if (event.key === "ArrowRight") emitMoveBouncer("right", true);
    };

    const onKeyup = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") emitMoveBouncer("left", false);
      if (event.key === "ArrowRight") emitMoveBouncer("right", false);
    };

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("keyup", onKeyup);
    };
  }, [balls, bouncers, bricks, emitMoveBouncer, roomId, socket]);

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
  //   });
  // }, [ball, bouncers, bricks, socket]);

  return (
    <div className={styles.canvas} ref={canvasRef}>
      {bricks.map((brick) => (
        <Brick key={brick.id} {...brick} />
      ))}
      {bouncers.map((bouncer) => (
        <Bouncer key={bouncer.id} {...bouncer} />
      ))}
      {balls.map((ball) => (
        <Ball key={ball.id} {...ball} />
      ))}
      {rewards.map((reward) => (
        <Reward key={reward.id} {...reward} />
      ))}
    </div>
  );
};

export default Canvas;
