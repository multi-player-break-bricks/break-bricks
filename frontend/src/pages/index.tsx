import { useLocalStorage } from "@/hooks/useLocalStorage";
import Head from "next/head";
import styles from "./Home.module.css";
import BlockChainLogin from "@/components/BlockChain/block_chain_login";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/router";

export default function Home() {
  const [name, setName] = useLocalStorage("name");
  const router = useRouter();

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
            <BlockChainLogin />
          </div>
        </div>
      </main>
    </>
  );
}
