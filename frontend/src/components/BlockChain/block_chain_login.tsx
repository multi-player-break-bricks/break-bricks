/* eslint-disable react-hooks/rules-of-hooks */
import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useCallback, useEffect } from "react";
import { ethers } from "ethers";
import {
  electricNFTContractAbi,
  electricNFTContractAddress,
  targetChainIDInHex,
} from "./constants";
import { MetaMaskInpageProvider } from "@metamask/providers";

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

function login() {
  const [loggedInBefore, setLoggedInBefore] = useLocalStorage("loggedInBefore");
  const [loggedIn, setloggedIn] = useLocalStorage("loggedIn");
  const [currentAccount, setCurrentAccount] = React.useState<any>();
  const [theNumber, setTheNumber] = React.useState<number>();

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
  }, []);

  useEffect(() => {
    console.log("test");
  }, []);

  //listen to account change
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts: any) =>
      setCurrentAccount(accounts[0])
    );
  });

  /**
   * @description connect to metamask
   */
  const connectWallet = async () => {
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
  };

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
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"></img>
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

export default login;
