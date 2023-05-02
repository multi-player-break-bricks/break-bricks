import { useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (socket) return socket;
    console.log("Connecting socket");
    const socketTemp: Socket = io(serverPath);
    setSocket(socketTemp);
    return socketTemp;
  }, [serverPath, socket]);

  const disconnectSocket = useCallback(() => {
    if (!socket) return;
    socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
};
