import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

import {
  createWaitRoom,
  joinWaitRoomWithNumber,
  joinRandomRoom,
  savePlayerName,
} from "./utils/rooms.ts";

const developmentUrl = "http://localhost:3000";
const productionUrl = "https://lingpal.vercel.app";

const io = new Server({
  cors: {
    origin: [developmentUrl, productionUrl],
  },
});

io.on("connection", (socket) => {
  socket.on("send-name", (name) => {
    savePlayerName(socket.id, name);
    socket.emit("name-saved");
  });

  socket.on("create-wait-room", ({ isPublic, name }) => {
    console.log("create-wait-room");
    savePlayerName(socket.id, name);
    const { waitRoomNumber, roomId } = createWaitRoom(isPublic, socket.id);
    socket.join(roomId);
    socket.emit("wait-room-created", {
      players: [name],
      roomNumber: waitRoomNumber,
    });
  });

  socket.on("join-wait-room-with-id", ({ roomNumber, name }) => {
    console.log("join-wait-room-with-id");
    savePlayerName(socket.id, name);
    const result = joinWaitRoomWithNumber(roomNumber, socket.id);
    if (result.error) {
      socket.emit("join-wait-room-error", result.error);
      return;
    }
    const { waitRoomId, players } = result;
    socket.join(waitRoomId!);
    socket.emit("join-wait-room", { players, roomNumber });
    io.to(waitRoomId!).emit("wait-room-updated", {
      players,
    });
  });

  socket.on("join-random-wait-room", (name) => {
    savePlayerName(socket.id, name);
    const { players, roomId, waitRoomNumber } = joinRandomRoom(socket.id);
    socket.join(roomId);
    socket.emit("join-wait-room", { players, roomNumber: waitRoomNumber });
    io.to(roomId).emit("wait-room-updated", { players });
  });

  socket.on("disconnect", () => {
    // console.log("disconnected", socket.id);
  });
});

const PORT = Deno.env.get("PORT") || 5050;

await serve(io.handler(), {
  port: Number(PORT),
});
