import { useLocalStorage } from "@/hooks/useLocalStorage";
import Head from "next/head";
import Link from "next/link";
import styles from "./Home.module.css";
import login from "@/components/BlockChain/block_chain_login";

export default function Home() {
  const [name, setName] = useLocalStorage("name");

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
          <h1 className={styles.title}>Break Bricks Multiplayer</h1>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Enter a name to get started</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Link className="button" href="/join">
            Let&apos;s go
          </Link>
          {login()}
        </div>
      </main>
    </>
  );
}
