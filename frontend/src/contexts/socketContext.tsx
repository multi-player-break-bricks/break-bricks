import React, { createContext, PropsWithChildren, useContext } from "react";
import { useSocket } from "../hooks/useSocket";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => Socket;
  disconnectSocket: () => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

const useSocketContext = () => {
  const currentSocketContext = useContext(SocketContext);
  if (!currentSocketContext) {
    throw new Error(
      "useSocketContext has to be used within <SocketContextProvider>"
    );
  }
  return currentSocketContext;
};

const SocketContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const { socket, connectSocket, disconnectSocket } = useSocket(
    process.env.NEXT_PUBLIC_REMOTE_BACKEND_URL!
  );

  return (
    <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export { useSocketContext, SocketContextProvider };
