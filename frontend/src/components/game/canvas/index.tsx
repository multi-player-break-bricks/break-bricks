import { useSocketContext } from "@/contexts/socketContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { initialBalls, initialBouncers, initialBricks } from "./seeds";
import styles from "./index.module.css";
import { Brick } from "../brick/Brick";
import { Bouncer } from "../bouncer/Bouncer";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { Ball } from "../ball/Ball";
import { Reward } from "../reward/Reward";

const Canvas = () => {
  const { socket } = useSocketContext();

  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  const [bouncers, setBouncers] = useState<Bouncer[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  const canvasSize = useCanvasSize();

  const canvasRef = useRef<HTMLDivElement | null>(null);

  const playerNumber = players.find((p) => p.id === socket?.id)?.number;

  useEffect(() => {
    if (!canvasRef.current || !playerNumber) return;
    const canvas = canvasRef.current;
    canvas?.style.setProperty("width", `${canvasSize}px`);
    canvas?.style.setProperty("height", `${canvasSize}px`);
    canvas?.style.setProperty(
      "transform",
      `rotate(${-90 * (playerNumber - 1)}deg)`
    );
  }, [canvasRef, canvasSize, playerNumber]);

  useEffect(() => {
    if (!socket || !socket.connected) {
      console.log("socket not connected in canvas");
      return;
    }
    socket.on("join-room-success", (room) => {
      const { gameInfo, id, players } = room;
      console.log("join-room-success in canvas", { gameInfo, roomId: id });
      setRoomId(id);
      setPlayers(players);
      setBouncers(gameInfo.bouncers);
      setBalls(gameInfo.balls);
      setBricks(gameInfo.bricks);
      setInterval(() => {
        socket.emit("request-game-info", room.id);
      }, 1000 / 16);
    });

    return () => {
      socket.off("join-room-success");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("frame-change", ({ bouncers, balls, bricks, rewards }) => {
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
      console.log("emitMoveBouncer from room", roomId);
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
