import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (socket) return;
    const socketTemp: Socket = io(serverPath);
    setSocket(socketTemp);
  }, [serverPath, socket]);

  const disconnectSocket = useCallback(() => {
    if (!socket) return;
    socket.disconnect();
  }, [socket]);

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
};
