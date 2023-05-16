import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { targetChainIDInHex } from "@/components/BlockChain/constants";

type MetamaskContextType = {
  currentAccount: string;
  connectWallet: () => void;
};

const MetamaskContext = createContext<MetamaskContextType | null>(null);

const useMetamaskContext = () => {
  const currentMetamaskContext = useContext(MetamaskContext);
  if (!currentMetamaskContext) {
    throw new Error(
      "useMetamaskContext has to be used within <MetamaskContextProvider>"
    );
  }
  return currentMetamaskContext;
};

const MetamaskContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentAccount, setCurrentAccount] = useState("");
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
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", (accounts: any) => {
      if (accounts.length === 0) {
        setCurrentAccount("");
        return;
      } else {
        setCurrentAccount(accounts[0]);
      }
    });
  }, []);

  return (
    <MetamaskContext.Provider value={{ currentAccount, connectWallet }}>
      {children}
    </MetamaskContext.Provider>
  );
};

export { useMetamaskContext, MetamaskContextProvider };
