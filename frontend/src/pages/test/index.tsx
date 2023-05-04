import { useSocketContext } from "@/contexts/socketContext";
import { Player } from "@/types/types";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Canvas from "./../../components/game/canvas/index";

export default function TestPage() {
  const { socket } = useSocketContext();
  const { connectSocket, disconnectSocket } = useSocketContext();

  const [players, setPlayers] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState("");
  const [gameInstance, setGameInstance] = useState<object>({});

  const router = useRouter();

  useEffect(() => {
    const socket = connectSocket();
    socket.emit("join-game-room-test");
    socket.on("join-room-success", (room) => {
      setRoomId(room.id);
      setPlayers(room.players);
      setInterval(() => {
        socket?.emit("request-game-info", room.id);
      }, 1000);
    });
  }, [connectSocket, router, socket]);

  useEffect(() => {
    socket?.on("game-info", (data) => {
      console.log(data);
    });

    return () => {
      socket?.off("game-info");
    };
  }, [socket]);

  return (
    <main className="main">
      <h1 className={styles.title}>
        Room {roomId} with player {players?.[0]?.name}
      </h1>
      {Canvas()}
    </main>
  );
}
