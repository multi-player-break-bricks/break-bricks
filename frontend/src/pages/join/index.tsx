import { useSocketContext } from "@/contexts/socketContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "./index.module.css";
import {
  checkNftExistance,
  useBlockchainContext,
} from "@/components/BlockChain/block_chain_handler";
import Image from "next/image";
import { nftContracts, NFTtype } from "@/components/BlockChain/NFts";

export default function JoinPage() {
  const { isConnectedToMetamask, currentWalletAddress, getNFTbyName } =
    useBlockchainContext();
  const { connectSocket, disconnectSocket } = useSocketContext();
  const [roomId, setRoomId] = useState("");
  const [skinPanelOpen, setSkinPanelOpen] = useState(false);
  const [skinAvailableMap, setSkinAvailable] = useState<Map<string, boolean>>(
    new Map()
  );

  const router = useRouter();
  const [name] = useLocalStorage("name");
  const [useSkinName, setUseSkinName] = useLocalStorage("useSkin");

  const isPublicRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("message", () => {
      checkNfts();
    });

    window.ethereum.on("accountsChanged", () => {
      checkNfts();
    });
  }, []);

  //check if the user has the NFT
  useEffect(() => {
    checkNfts();
  }, [setSkinPanelOpen, isConnectedToMetamask, currentWalletAddress]);

  useEffect(() => {
    if (skinAvailableMap.get(useSkinName) === false) {
      setUseSkinName("default");
    }
  }, [skinAvailableMap, useSkinName, setUseSkinName]);

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
    socket.emit("join-random-wait-room", name);
    listenToJoinRoom(socket);
  };

  const isValidRoomId =
    roomId.length === 4 && parseInt(roomId) > 0 && parseInt(roomId) < 10000;

  const checkNfts = async () => {
    const nftMap = new Map<string, boolean>();
    for (const contract of nftContracts) {
      try {
        nftMap.set(
          contract.skinName,
          await checkNftExistance(contract.skinName)
        );
      } catch (error) {
        nftMap.set(contract.skinName, false);
      }
    }
    setSkinAvailable(nftMap);
  };

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

        {isConnectedToMetamask() ? (
          <button onClick={() => setSkinPanelOpen(true)}>change skin</button>
        ) : (
          <button disabled>login to use skin</button>
        )}

        {skinPanelOpen && (
          <div className={styles.skinPanel}>
            {!useSkinName && setUseSkinName("default")}
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
                {useSkinName === "default" && (
                  <button disabled>selected</button>
                )}
                {useSkinName !== "default" && (
                  <button onClick={() => setUseSkinName("default")}>
                    select
                  </button>
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
                  {useSkinName === nft.skinName && (
                    <button disabled>selected</button>
                  )}
                  {useSkinName !== nft.skinName &&
                    (skinAvailableMap.get(nft.skinName) ? (
                      <button onClick={() => setUseSkinName(nft.skinName)}>
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
