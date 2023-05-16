import { getAllNftAvailibility } from "@/lib/blockChainHelpers";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useMetamaskContext } from "@/contexts/metaMaskContext";

export function useSkin() {
  const { currentAccount } = useMetamaskContext();
  const [useSkinName, setUseSkinName] = useLocalStorage("useSkin");
  const [skinAvailableMap, setSkinAvailable] = useState<Map<string, boolean>>(
    new Map()
  );

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("message", () => {
      getAllNftAvailibility(currentAccount).then((nftMap) => {
        setSkinAvailable(nftMap);
      });
    });

    window.ethereum.on("accountsChanged", () => {
      getAllNftAvailibility(currentAccount).then((nftMap) => {
        setSkinAvailable(nftMap);
      });
    });
  }, [currentAccount]);

  //check if the user has the NFT
  useEffect(() => {
    getAllNftAvailibility(currentAccount).then((nftMap) => {
      setSkinAvailable(nftMap);
    });
  }, [currentAccount]);

  useEffect(() => {
    if (skinAvailableMap.get(useSkinName) === false) {
      setUseSkinName("default");
    }
  }, [skinAvailableMap, useSkinName, setUseSkinName]);

  return {
    skinAvailableMap,
  };
}
