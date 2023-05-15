import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useCallback, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { targetChainIDInHex } from "./constants";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Fox from "./fox.svg";
import Image from "next/image";
import Router from "next/router";
import styles from "./blockchain.module.css";
import { createContext } from "react";
import { nftContracts, NFTtype } from "./NFts";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type BlockChainContext = {
  isConnectedToMetamask: () => boolean;
  currentWalletAddress: () => string | undefined;
  checkNftExistance: (NFTName: string) => Promise<boolean>;
  getNFTbyName: (NFTName: string) => void;
};

export const BlockChainContext = createContext<BlockChainContext | null>(null);

const getNFTContract = async (
  NFTAddress: string,
  NFTabi: ethers.InterfaceAbi
) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFTAddress, NFTabi, await signer);

  return contract;
};

const getNFT = async (NFTAddress: string, NFTabi: ethers.InterfaceAbi) => {
  const contract = await getNFTContract(NFTAddress, NFTabi);
  try {
    await contract.mint();

    //try {
    // wasAdded is a boolean. Like any RPC method, an error can be thrown.
    // const wasAdded = await window.ethereum.request({
    //   method: "wallet_watchAsset",
    //   params: {
    //     type: "ERC20",
    //     options: {
    //       address: NFTAddress, // The address of the token.
    //       symbol: "tokenSymbol", // A ticker symbol or shorthand, up to 5 characters.
    //       decimals: 18, // The number of decimals in the token.
    //       image: null,
    //     },
    //   },
    // });
    //
    //   if (wasAdded) {
    //     console.log("Thanks for your interest!");
    //   } else {
    //     console.log("Your loss!");
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  } catch (error) {
    console.log(error);
    alert("get NFT failed");
  }
};

const getNFTbyName = async (NFTName: string) => {
  let nft: NFTtype | undefined;
  nftContracts.forEach((contract: NFTtype) => {
    if (contract.skinName === NFTName) {
      nft = contract;
    }
  });

  if (nft === undefined) {
    throw new Error("NFT not found");
  }

  await getNFT(nft.address, nft.abi);
};

/**
 * @description check if the user has the NFT
 */
export async function checkNftExistance(NFTName: string): Promise<boolean> {
  if (!currentWalletAddress()) {
    return false;
  }

  let nft: NFTtype | undefined;
  nftContracts.forEach((contract: NFTtype) => {
    if (contract.skinName === NFTName) {
      nft = contract;
    }
  });

  if (nft === undefined) {
    throw new Error("NFT not found");
  }

  const contract = await getNFTContract(nft.address, nft.abi);

  try {
    const accountBalance = await contract.balanceOf(currentWalletAddress());
    if (accountBalance > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const useBlockchainContext = () => {
  const context = useContext(BlockChainContext);
  if (!context) {
    throw new Error("useBlockchain must be used within a BlockChainHandler");
  }
  return context;
};

let currentAccount: string | undefined;
let setCurrentAccount = (account: string | undefined) => {
  currentAccount = account;
};

function isConnectedToMetamask() {
  return currentAccount !== undefined;
}

function currentWalletAddress(): string | undefined {
  return currentAccount;
}

export const BlockChainContextProvider: BlockChainContext = {
  isConnectedToMetamask,
  currentWalletAddress,
  checkNftExistance,
  getNFTbyName,
};

function BlockChainHandler() {
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
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainIDInHex }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: targetChainIDInHex,
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
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
        console.log("Connected", accounts[0]);
        Router.push({
          pathname: "/",
          query: { address: accounts[0] },
        });
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //init
  // useEffect(() => {
  //   //if the user has logged in before, try to connect to metamask

  //   const init = async () => {
  //     if (loggedInBefore == "true") {
  //       if (!window.ethereum) {
  //         return;
  //       }
  //       await connectWallet();
  //     }
  //   };

  //   if (!currentAccount) {
  //     setloggedIn("false");
  //     init();
  //   }
  // }, [connectWallet, currentAccount, loggedInBefore, setloggedIn]);

  //listen to account change
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts: any) => {
      if (accounts.length === 0) {
        setCurrentAccount(undefined);
        return;
      } else {
        setCurrentAccount(accounts[0]);
      }
    });
  }, []);

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

export default BlockChainHandler;
