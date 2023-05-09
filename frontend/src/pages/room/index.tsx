import { useSocketContext } from "@/contexts/socketContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

export default function RoomPage() {
  const { socket } = useSocketContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!socket || !socket.connected) {
      router.push("/join");
      return;
    }
    socket.emit("join-room");
  }, [router, socket]);

  useEffect(() => {
    socket?.on("join-room-success", (data) => {
      setPlayers(data.players);
      setRoomNumber(data.number);
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
    socket?.on("wait-room-updated", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket?.off("wait-room-updated");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("countdown", (countDown) => {
      setCountdown(countDown);
      if (countDown === 0) {
        router.push("/game");
      }
    });

    return () => {
      socket?.off("countdown");
    };
  }, [router, socket]);

  const getReady = () => {
    socket?.emit("update-player-ready", { roomNumber, isReady: !isReady });
    setIsReady(!isReady);
  };

  return (
    <main className="main">
      <div className={styles.container}>
        <div className={styles.col}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Room #{roomNumber}</h1>
            <Link className={styles.leaveLink} href={"/join"}>
              Leave
            </Link>
          </div>
          <p className={styles.hint}>A game can start with 2-4 players</p>
          <ul className={styles.playerList}>
            {Array.from(Array(4).keys()).map((i) => {
              const player = players[i];
              if (i < players.length) {
                return (
                  <li className={styles.playerItem} key={player.id}>
                    <p>{player.name}</p>
                    <div
                      className={styles.indicator}
                      style={{
                        backgroundColor: player.isReady ? "green" : "orange",
                      }}
                    ></div>
                  </li>
                );
              } else {
                return (
                  <li className={styles.playerItem} key={i}>
                    <p>...</p>
                  </li>
                );
              }
            })}
          </ul>
          <button onClick={getReady}>I&apos;m ready</button>
        </div>
        {countdown !== null ? (
          <div className={styles.countdownContainer}>
            <h2 className={styles.countdown}>Game starts in {countdown}</h2>
          </div>
        ) : (
          <div className={styles.col}>
            <h2>Rules</h2>
          </div>
        )}
      </div>
    </main>
  );
}
