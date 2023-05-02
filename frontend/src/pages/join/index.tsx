import { useGameContext } from "@/contexts/gameContext";
import { useSocketContext } from "@/contexts/socketContext";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

export default function JoinPage() {
  const { connectSocket, disconnectSocket, socket } = useSocketContext();
  const { name } = useGameContext();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [roomId, setRoomId] = useState("");

  const isPublicRef = useRef<HTMLInputElement>(null);

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
      socket.emit("send-name", name);
      socket.on("name-saved", () => {
        setIsSocketConnected(true);
      });
    });
  }, [name, socket]);

  const createRoom = () => {
    console.log({ socket }, isPublicRef.current?.checked);
    socket?.emit("create-wait-room", {
      isPublic: isPublicRef.current?.checked,
    });
    socket?.on("wait-room-created", (data) => {
      console.log(data);
    });
  };

  const joinRoomWithId = () => {
    socket?.emit("join-wait-room-with-id", {
      roomNumber: roomId,
    });
    socket?.on("join-wait-room", ({ players, roomNumber }) => {
      console.log({ players, roomNumber });
    });
    socket?.on("join-wait-room-error", (error) => {
      console.log({ error });
    });
  };

  const joinRandomRoom = () => {
    socket?.emit("join-random-wait-room");
    socket?.on("join-wait-room", ({ players, roomNumber }) => {
      console.log({ players, roomNumber });
    });
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
            <button disabled={!isSocketConnected} onClick={createRoom}>
              Create Room
            </button>
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
            <button
              disabled={!isSocketConnected || !isValidRoomId}
              onClick={joinRoomWithId}
            >
              Join
            </button>
          </article>
          <article>
            <h2>Join a random room.</h2>
            <button disabled={!isSocketConnected} onClick={joinRandomRoom}>
              Quick Start
            </button>
          </article>
        </div>
      </div>
    </main>
  );
}
