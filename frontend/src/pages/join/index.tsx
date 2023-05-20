import { useSocketContext } from "@/contexts/socketContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./index.module.css";
import Image from "next/image";
import { nftContracts } from "@/components/BlockChain/NFts";
import { Button } from "@/components/button/Button";
import { useSkin } from "@/hooks/useSkin";
import { getNFTbyName } from "@/lib/blockChainHelpers";
import { useMetamaskContext } from "@/contexts/metaMaskContext";

export default function JoinPage() {
  const { currentAccount } = useMetamaskContext();
  const { connectSocket, disconnectSocket } = useSocketContext();
  const [roomId, setRoomId] = useState("");
  const [skinPanelOpen, setSkinPanelOpen] = useState(false);

  const router = useRouter();
  const [name] = useLocalStorage("name");
  const [skinName, setSkinName] = useLocalStorage("useSkin");
  const { skinAvailableMap } = useSkin();

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
      skinName,
    });
    listenToJoinRoom(socket);
  };

  const joinRoomWithId = () => {
    const socket = connectSocket();
    socket.emit("join-wait-room-with-id", {
      roomNumber: roomId,
      name,
      skinName,
    });
    listenToJoinRoom(socket);
    socket.on("join-wait-room-error", (error) => {
      console.log({ error });
    });
  };

  const joinRandomRoom = () => {
    const socket = connectSocket();
    socket.emit("join-random-wait-room", { name, skinName });
    listenToJoinRoom(socket);
  };

  const isValidRoomId =
    roomId.length === 4 && parseInt(roomId) > 0 && parseInt(roomId) < 10000;

  return (
    <main className="main">
      <div className={styles.container}>
        <h1 className={styles.title}>Select a way to start</h1>
        <div className={styles.waysToJoin}>
          <article>
            <h2>Create a new room.</h2>
            <div className={styles.checkboxGroup}>
              <input type="checkbox" id="isPublic" ref={isPublicRef} />
              <label htmlFor="isPublic">Public room</label>
            </div>
            <Button onClick={createRoom}>Create</Button>
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
            <Button disabled={!isValidRoomId} onClick={joinRoomWithId}>
              Join
            </Button>
          </article>
          <article>
            <h2>Join a random room.</h2>
            <button onClick={joinRandomRoom}>Quick Start</button>
          </article>
        </div>

        {currentAccount ? (
          <button onClick={() => setSkinPanelOpen(true)}>change skin</button>
        ) : (
          <button disabled>login to use skin</button>
        )}

        {skinPanelOpen && (
          <div className={styles.skinPanel}>
            {!skinName && setSkinName("default")}
            <button onClick={() => setSkinPanelOpen(false)}>close</button>
            <div className={styles.skinList}>
              <div className={styles.skinItem}>
                <Image
                  src={`/images/skin/default.png`}
                  width={100}
                  height={100}
                  alt=""
                />
                <h3>default</h3>
                {skinName === "default" && <button disabled>selected</button>}
                {skinName !== "default" && (
                  <button onClick={() => setSkinName("default")}>select</button>
                )}
              </div>

              {nftContracts.map((nft) => (
                <div key={nft.skinName} className={styles.skinItem}>
                  <Image
                    src={`/images/skin/${nft.skinName}.png`}
                    width={100}
                    height={100}
                    alt=""
                  />
                  <h3>{nft.skinName}</h3>
                  {skinName === nft.skinName && (
                    <button disabled>selected</button>
                  )}
                  {skinName !== nft.skinName &&
                    (skinAvailableMap.get(nft.skinName) ? (
                      <button onClick={() => setSkinName(nft.skinName)}>
                        select
                      </button>
                    ) : (
                      <button onClick={() => getNFTbyName(nft.skinName)}>
                        get
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
