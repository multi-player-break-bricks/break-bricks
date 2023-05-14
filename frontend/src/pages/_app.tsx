import { SocketContextProvider } from "@/contexts/socketContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import BlockChainHandler, {
  BlockChainContext,
  BlockChainContextProvider,
} from "../components/BlockChain/block_chain_handler";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <BlockChainContext.Provider value={BlockChainContextProvider}>
        <SocketContextProvider>
          <Component {...pageProps} />
          <BlockChainHandler />
        </SocketContextProvider>
      </BlockChainContext.Provider>
    </>
  );
}
