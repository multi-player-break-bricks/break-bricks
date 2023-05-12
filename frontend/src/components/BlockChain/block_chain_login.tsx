/* eslint-disable react-hooks/rules-of-hooks */
import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./constants";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    contractAbi,
    await signer
  );

  return contract;
};

function login() {
  const [loggedInBefore, setLoggedInBefore] = useLocalStorage("loggedInBefore");
  const [loggedIn, setloggedIn] = useLocalStorage("loggedIn");
  const [currentAccount, setCurrentAccount] = React.useState<any>();
  const [theNumber, setTheNumber] = React.useState<number>();

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts: any) =>
      setCurrentAccount(accounts[0])
    );
  });

  useEffect(() => {
    setloggedIn("false");
    const init = async () => {
      console.log("loggedInBefore", loggedInBefore);
      if (loggedInBefore == "true") {
        if (!window.ethereum) return;
        await connectWallet();
        console.log("currentAccount", currentAccount);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("install MetaMask browser extension for login");
      return;
    }
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts: any = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts) {
        alert("can not connect to MetaMask. Account not found.");
        return;
      }
      setloggedIn("true");
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkNftExistance = async () => {
    const contract = await getContract();

    if (!currentAccount) return;
    console.log("contract", contract);

    try {
      let idx = 0;
      while (true) {
        const contractOwner = await contract.ownerOf(idx++);
        console.log(
          "contractOwner",
          contractOwner.toLowerCase() +
            "\ncurrentAccount: " +
            currentAccount.toLowerCase()
        );
        if (contractOwner.toLowerCase() === currentAccount.toLowerCase()) {
          console.log("find the owner at idx:", idx);
          break;
        }
      }
    } catch (error) {
      console.log("no owner found");
      console.log(error);
    }

    //setTheNumber(Number(result._hex));
  };

  return (
    <div className="">
      <h1>login block chain</h1>
      {!currentAccount ? (
        <button
          onClick={() => {
            connectWallet();
            setLoggedInBefore("true");
          }}
        >
          Login in Metamask
        </button>
      ) : (
        <>
          <p>wallet address: {currentAccount}</p>
        </>
      )}
    </div>
  );
}

export default login;
