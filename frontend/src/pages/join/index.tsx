import { useSocketContext } from "@/contexts/socketContext";
import Link from "next/link";
import React, { useEffect } from "react";
import styles from "./index.module.css";

export default function JoinPage() {
  const { connectSocket, disconnectSocket, socket } = useSocketContext();

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("socket connected");
    });
    socket.emit("join-room", "test");

    return () => {
      socket.off("join-room");
    };
  }, [socket]);

  return (
    <div>
      JoinPage
      <Link href="/room">room</Link>
    </div>
  );
}
