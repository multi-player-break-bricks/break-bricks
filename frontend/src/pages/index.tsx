import { useSocketContext } from "@/contexts/socketContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Head from "next/head";
import styles from "./Home.module.css";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface LeaderboardObject {
  name: string;
  score: number;
  time: string;
}

export default function Home() {
  const [name, setName] = useLocalStorage("name");
  const router = useRouter();
  const { connectSocket, disconnectSocket } = useSocketContext();

  const [leaderboard, setLeaderboard] = useState<LeaderboardObject[]>([]);

  useEffect(() => {
    const socket = connectSocket();
    socket?.emit("fetch-leaderboard");
    socket?.on("show-leaderboard", (leaderboardString: LeaderboardObject[]) => {
      setLeaderboard(leaderboardString);
      return () => socket.off("show-leaderboard");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNames = () => {
    return leaderboard.map((obj) => obj.name);
  };

  return (
    <>
      <Head>
        <title>Break Bricks</title>
        <meta name="description" content="Multi player game Break Bricks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <div className={styles.container}>
          <header>
            <h1 className={styles.title}>
              Break <br />
              Bricks
            </h1>
            <h2 className={styles.subtitle}>Multiplayer</h2>
          </header>
          <div className={styles.board}>
            <h3>Leaderboard</h3>
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((obj, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{obj.name}</td>
                    <td>{obj.score}</td>
                    <td>{obj.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.login}>
            <h3>Enter a name to get started</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              onClick={() => router.push("/join")}
              className={styles.startButton}
            >
              Let&apos;s go
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
