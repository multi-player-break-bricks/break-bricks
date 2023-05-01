import { SocketContextProvider } from "@/contexts/socketContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketContextProvider>
      <Component {...pageProps} />
    </SocketContextProvider>
  );
}
