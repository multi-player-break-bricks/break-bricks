import { useSocketContext } from "@/contexts/socketContext";
import { Player } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function GamePage() {
  const { socket } = useSocketContext();
  const [players, setPlayers] = useState<Player[]>([]);

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

  return (
    <main className="main">
      <h1 className={styles.title}>Game Page</h1>
      <p>{JSON.stringify(players)}</p>
    </main>
  );
}
