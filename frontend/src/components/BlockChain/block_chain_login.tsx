import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import {
  electricNFTContractAbi,
  electricNFTContractAddress,
  targetChainIDInHex,
} from "./constants";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Fox from "./fox.svg";
import Image from "next/image";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
const getElectricBouncerNFTContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    electricNFTContractAddress,
    electricNFTContractAbi,
    await signer
  );

  return contract;
};

function BlockChainLogin() {
  const [loggedInBefore, setLoggedInBefore] = useLocalStorage("loggedInBefore");
  const [, setloggedIn] = useLocalStorage("loggedIn");
  const [currentAccount, setCurrentAccount] = React.useState<any>();

  /**
   * @description connect to metamask
   */
  const connectWallet = useCallback(async () => {
    //check if metamask is installed
    if (!window.ethereum) {
      alert("install MetaMask browser extension for login");
      return;
    }

    //check if metamask is connected to the right network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== targetChainIDInHex) {
      alert("Please connect to the Sepolia network");
      return;
    }

    //connect to metamask
    try {
      const { ethereum } = window;
      const accounts: any = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts) {
        alert("can not connect to MetaMask. Account not found.");
      } else {
        setloggedIn("true");
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [setloggedIn]);

  //init
  useEffect(() => {
    //if the user has logged in before, try to connect to metamask
    setloggedIn("false");
    const init = async () => {
      if (loggedInBefore == "true") {
        if (!window.ethereum) {
          return;
        }
        await connectWallet();
      }
    };
    init();
  }, [connectWallet, loggedInBefore, setloggedIn]);

  useEffect(() => {
    console.log("test");
  }, []);

  //listen to account change
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts: any) =>
      setCurrentAccount(accounts[0])
    );
  }, []);

  /**
   * @description TEST: check if the user has the NFT
   */
  const checkNftExistance = async () => {
    if (!currentAccount) {
      return;
    }

    const contract = await getElectricBouncerNFTContract();

    try {
      while (true) {
        const accountBalance = await contract.balanceOf(currentAccount);
        if (accountBalance > 0) {
          console.log("NFT found");
        } else {
          console.log("NFT not found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      {!currentAccount ? (
        <button
          onClick={() => {
            connectWallet();
            setLoggedInBefore("true");
          }}
        >
          Login in Metamask
          <Image src={Fox} alt="fox" width={50} height={50} />
        </button>
      ) : (
        <>
          <p>wallet address: {currentAccount}</p>
          <button onClick={() => checkNftExistance()}> test</button>
        </>
      )}
    </div>
  );
}

export default BlockChainLogin;
