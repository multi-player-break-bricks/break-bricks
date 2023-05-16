import { useSocketContext } from "@/contexts/socketContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { Brick } from "../brick/Brick";
import { Bouncer } from "../bouncer/Bouncer";
import { useCanvasSize } from "@/hooks/useCanvasSize";
import { Ball } from "../ball/Ball";
import { Reward } from "../reward/Reward";
import { Wall } from "../wall/Wall";
import { BlockingObject } from "../blockingObject/BlockingObject";
import { useRouter } from "next/router";

type Props = {
  gameStatus: GameStatus;
  setGameStatus: React.Dispatch<React.SetStateAction<GameStatus>>;
};

const Canvas = ({ gameStatus, setGameStatus }: Props) => {
  const { socket } = useSocketContext();

  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  const [bouncers, setBouncers] = useState<Bouncer[]>([]);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [bricksMap, setBricksMap] = useState<Record<string, Brick>>({});
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [blockingObjects, setBlockingObjects] = useState<BlockingObject[]>([]);

  const canvasSize = useCanvasSize();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const playerNumber = players.find((p) => p.id === socket?.id)?.number;
  const bricks = Object.values(bricksMap);

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
      setBricksMap(gameInfo.bricks);
      setWalls(gameInfo.walls);
      setBlockingObjects(gameInfo.blockingObjects);
      socket.emit("request-game-info", room.id);
    });

    return () => {
      socket.off("join-room-success");
    };
  }, [socket]);

  const updateBricks = useCallback((updates: Record<number, Brick>) => {
    if (!Object.keys(updates).length) return;
    Object.entries(updates).forEach(([keyToUpdate, newValue]) => {
      if (newValue.level === 0) {
        setBricksMap((prev) =>
          Object.fromEntries(
            Object.entries(prev).filter(([key]) => key !== keyToUpdate)
          )
        );
      } else {
        setBricksMap((prev) => ({ ...prev, [keyToUpdate]: newValue }));
      }
    });
  }, []);

  useEffect(() => {
    socket?.on(
      "frame-change",
      ({ bouncers, balls, bricks, rewards, walls, blockingObjects, gameStatus }) => {
        setBouncers(bouncers);
        setBalls(balls);
        setWalls(walls);
        updateBricks(bricks);
        setRewards(rewards);
        setGameStatus(gameStatus);
        setBlockingObjects(blockingObjects);
      }
    );

    return () => {
      socket?.off("frame-change");
    };
  }, [setGameStatus, socket, updateBricks,]);

  const emitMoveBouncer = useCallback(
    (direction: "left" | "right", pressed: boolean) => {
      const player = players.find((p) => p.id === socket?.id);
      socket?.emit("move-bouncer", {
        direction,
        pressed,
        playerNumber: player?.number,
      });
    },
    [players, socket]
  );

  const emitPlayer1Shooting = useCallback(
    () => {
      socket?.emit("player-1-shoot-starting-ball", {});
    },
    [socket]
  );

  useEffect(() => {
    if (!roomId) return;
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") emitMoveBouncer("left", true);
      if (event.key === "ArrowRight") emitMoveBouncer("right", true);
      if (event.key === " ") emitPlayer1Shooting();
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
  }, [balls, bouncers, bricksMap, emitMoveBouncer, emitPlayer1Shooting, roomId, socket]);

  const returnToWaitRoom = () => {
    socket?.emit("return-to-wait-room", roomId);
    router.push("/room");
  };

  const leaveRoom = () => {
    router.push("/join");
  };

  return (
    <div
      className={`${styles.canvas} ${
        gameStatus.status !== "game running" ? styles.canvasOverlay : ""
      }`}
      ref={canvasRef}
    >
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
      {walls.map((wall) => (
        <Wall key={wall.id} {...wall} />
      ))}
      {blockingObjects.map((blockingObject) => (
        <BlockingObject key={blockingObject.id} {...blockingObject} />
      ))}
      {gameStatus.status !== "game running" && (
        <div
          style={{
            transform: playerNumber
              ? `rotate(${90 * (playerNumber - 1)}deg)`
              : "",
          }}
          className={styles.canvasPopupContainer}
        >
          <h2 className={styles.gameStatus}>{gameStatus.status}</h2>
          <div className={styles.buttonContainer}>
            <button onClick={returnToWaitRoom}>Play Again</button>
            <button onClick={leaveRoom}>Leave</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
