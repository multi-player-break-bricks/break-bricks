import { useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (socket && socket.connected) return socket;
    console.log("Connecting socket");
    const socketTemp: Socket = io(serverPath);
    setSocket(socketTemp);
    return socketTemp;
  }, [serverPath, socket]);

  const disconnectSocket = useCallback(() => {
    console.log("Disconnecting socket");
    socket?.disconnect();
  }, [socket]);

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
};
