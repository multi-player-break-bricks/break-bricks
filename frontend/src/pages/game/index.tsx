import { useSocketContext } from "@/contexts/socketContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Canvas from "./../../components/game/canvas/index";

export default function GamePage() {
  const { socket } = useSocketContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState("");
  const [gameInstance, setGameInstance] = useState<object>({});

  const router = useRouter();

  useEffect(() => {
    if (!socket || !socket.connected) {
      router.push("/join");
      return;
    }
    socket.emit("join-game-room");
  }, [router, socket]);

  useEffect(() => {
    setInterval(() => {
      socket?.emit("request-game-info", roomId);
    }, 1000);
  }, [socket, roomId]);

  useEffect(() => {
    socket?.on("game-info", (data) => {
      console.log(data);
    });

    return () => {
      socket?.off("game-info");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("join-room-success", (data) => {
      setPlayers(data.players);
      setRoomId(data.roomId);
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
      {<Canvas />}
    </main>
  );
}
