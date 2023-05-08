import { useSocketContext } from "@/contexts/socketContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Canvas from "./../../components/game/canvas/index";

export default function TestPage() {
  const { socket } = useSocketContext();
  const { connectSocket, disconnectSocket } = useSocketContext();

  const [players, setPlayers] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    if (socket) return;
    const tempSocket = connectSocket();
    tempSocket.emit("join-game-room-test");
  }, [connectSocket, disconnectSocket, socket]);

  useEffect(() => {
    socket?.on("join-room-success", (room) => {
      console.log(room);
      setRoomId(room.id);
      setPlayers(room.players);
    });

    return () => {
      socket?.off("join-room-success");
    };
  }, [socket]);

  return (
    <main className="main">
      <h1 className={styles.title}>
        Room {roomId} with player {players?.[0]?.name}
      </h1>
      <Canvas />
    </main>
  );
}
