import { SocketContextProvider } from "@/contexts/socketContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { BlockChainHandler } from "../components/BlockChain/BlockChainHandler";
import { MetamaskContextProvider } from "@/contexts/metaMaskContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskContextProvider>
      <SocketContextProvider>
        <Component {...pageProps} />
        <BlockChainHandler />
      </SocketContextProvider>
    </MetamaskContextProvider>
  );
}
