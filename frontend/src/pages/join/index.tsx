import { useSocketContext } from "@/contexts/socketContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./index.module.css";

export default function JoinPage() {
  const { connectSocket, disconnectSocket } = useSocketContext();
  const [roomId, setRoomId] = useState("");

  const router = useRouter();
  const [name] = useLocalStorage("name");

  const isPublicRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      disconnectSocket();
    }
    if (!name) {
      router.push("/");
    }
  }, [disconnectSocket, name, router]);

  const listenToJoinRoom = (socket: Socket) => {
    socket.on("join-wait-room", () => {
      router.push("/room");
    });
  };

  const createRoom = () => {
    const socket = connectSocket();
    socket.emit("create-wait-room", {
      isPublic: isPublicRef.current?.checked,
      name,
    });
    listenToJoinRoom(socket);
  };

  const joinRoomWithId = () => {
    const socket = connectSocket();
    socket.emit("join-wait-room-with-id", {
      roomNumber: roomId,
      name,
    });
    listenToJoinRoom(socket);
    socket.on("join-wait-room-error", (error) => {
      console.log({ error });
    });
  };

  const joinRandomRoom = () => {
    const socket = connectSocket();
    console.log("join random room, connected:", socket.connected);
    socket.emit("join-random-wait-room", name);
    listenToJoinRoom(socket);
  };

  const isValidRoomId =
    roomId.length === 4 && parseInt(roomId) > 0 && parseInt(roomId) < 10000;

  return (
    <main className="main">
      <div className={styles.container}>
        <h1 className={styles.title}>To join a game, you can</h1>
        <div className={styles.waysToJoin}>
          <article>
            <h2>Create your own room and get a room id.</h2>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="isPublic" ref={isPublicRef} />
              <label htmlFor="isPublic">Public room</label>
            </div>
            <button onClick={createRoom}>Create Room</button>
          </article>
          <article>
            <h2>Join a room with a room id.</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="roomId">Room id</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <button disabled={!isValidRoomId} onClick={joinRoomWithId}>
              Join
            </button>
          </article>
          <article>
            <h2>Join a random room.</h2>
            <button onClick={joinRandomRoom}>Quick Start</button>
          </article>
        </div>
      </div>
    </main>
  );
}
