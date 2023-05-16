import { MetaMaskInpageProvider } from "@metamask/providers";
import Fox from "./fox.svg";
import Image from "next/image";
import styles from "./blockchain.module.css";
import { useMetamaskContext } from "@/contexts/metaMaskContext";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export function BlockChainHandler() {
  const { connectWallet, currentAccount } = useMetamaskContext();

  return (
    <div id={styles.blockchain_profile}>
      {!currentAccount ? (
        <button
          className={styles.chain_login_button}
          onClick={() => {
            connectWallet();
          }}
        >
          <div>
            <h2>Login in Metamask</h2>
            <Image src={Fox} alt="fox" width={50} height={50} />
          </div>
        </button>
      ) : (
        <>
          {
            //this is only for debugging, should not display the wallet address on screen
            //<p>wallet address: {currentAccount}</p>
          }
          <h2>
            You have logged in!
            <br />
            You can now use skins
          </h2>
        </>
      )}
    </div>
  );
}
