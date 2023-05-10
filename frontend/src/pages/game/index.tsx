import { useSocketContext } from "@/contexts/socketContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Canvas from "./../../components/game/canvas/index";

export default function GamePage() {
  const { socket } = useSocketContext();

  const initialStatus = {
    status: "game running",
    scores: [],
  };

  const [gameStatus, setGameStatus] = useState<GameStatus>(initialStatus);
  const [players, setPlayers] = useState<Player[]>([]);

  const playersWithScore = players.map((player) => {
    const score = gameStatus.scores.find(
      (s) => s.number === player.number
    )?.score;
    return { ...player, score };
  });

  const router = useRouter();

  useEffect(() => {
    if (!socket || !socket.connected) {
      router.push("/join");
      return;
    }
    socket.emit("join-game-room");
  }, [router, socket]);

  useEffect(() => {
    socket?.on("join-room-success", (data) => {
      console.log("join-room-success in game room");
      setPlayers(data.players);
    });

    return () => {
      socket?.off("join-room-success");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("join-room-error", () => {
      router.push("/join");
    });

    return () => {
      socket?.off("join-room-error");
    };
  }, [router, socket]);

  useEffect(() => {
    socket?.on("player-left", (players) => {
      setPlayers(players);
      if (players.length < 2) {
        router.push("/join");
      }
    });

    return () => {
      socket?.off("player-left");
    };
  }, [router, socket]);

  return (
    <main>
      <h1 className={styles.title}>Game Page</h1>
      <div className={styles.mainContainer}>
        <Canvas gameStatus={gameStatus} setGameStatus={setGameStatus} />
        <div className="status">
          {playersWithScore.map((player) => (
            <p key={player.id}>
              {player.name} {player.score}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
