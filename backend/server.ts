import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";

import {
  createWaitRoom,
  joinWaitRoomWithNumber,
  joinRandomRoom,
  savePlayerName,
  findWaitRoom,
  removePlayerFromRoom,
  updatePlayerReady,
  moveWaitRoomToGameRoom,
  findGameRoom,
  createGameRoomTest,
} from "./utils/rooms.ts";
// import GameInstance from "./game/gameInstance.ts";

const developmentUrl = "http://localhost:3000";
const productionUrl = "https://lingpal.vercel.app";

let countdownInterval: number;

const io = new Server({
  cors: {
    origin: [developmentUrl, productionUrl],
  },
});

io.on("connection", (socket) => {
  socket.on("create-wait-room", ({ isPublic, name }) => {
    savePlayerName(socket.id, name);
    const { roomId } = createWaitRoom(isPublic, socket.id);
    socket.join(roomId);
    socket.emit("join-wait-room");
  });

  socket.on("join-wait-room-with-id", ({ roomNumber, name }) => {
    savePlayerName(socket.id, name);
    const result = joinWaitRoomWithNumber(roomNumber, socket.id);
    if (result.error) {
      socket.emit("join-wait-room-error", result.error);
      return;
    }
    const { waitRoomId, players } = result;
    socket.join(waitRoomId!);
    socket.emit("join-wait-room");
    io.to(waitRoomId!).emit("wait-room-updated", {
      players,
    });
  });

  socket.on("join-random-wait-room", (name) => {
    savePlayerName(socket.id, name);
    const { players, roomId } = joinRandomRoom(socket.id);
    socket.join(roomId);
    socket.emit("join-wait-room");
    io.to(roomId).emit("wait-room-updated", { players });
  });

  socket.on("join-room", () => {
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    const waitRoom = findWaitRoom(roomId.toString());
    if (!waitRoom) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    socket.emit("join-room-success", waitRoom);
  });

  socket.on("update-player-ready", ({ roomNumber, isReady }) => {
    const result = updatePlayerReady(roomNumber, socket.id, isReady);
    if (!result) return;
    const { roomId, players } = result;
    io.to(roomId).emit("wait-room-updated", { players });
    if (players.length < 2) return;
    if (players.some((player) => !player.isReady)) {
      clearInterval(countdownInterval);
      countdownInterval = 0;
      io.to(roomId).emit("countdown", null);
      return;
    }
    let count = 5;
    countdownInterval = setInterval(() => {
      io.to(roomId).emit("countdown", count);
      if (count === 0) {
        clearInterval(countdownInterval);
        countdownInterval = 0;
        moveWaitRoomToGameRoom(roomId);
      }
      count -= 1;
    }, 1000);
  });

  socket.on("join-game-room", () => {
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    const gameRoom = findGameRoom(roomId.toString());
    if (!gameRoom) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    socket.emit("join-room-success", gameRoom);
  });

  socket.on("request-game-info", (roomId) => {
    const gameRoom = findGameRoom(roomId.toString());
    if (!gameRoom) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    const { gameInstance } = gameRoom;
    const player1 = [gameInstance?.player1.xPos, gameInstance?.player1.yPos];
    socket.emit("game-info", { player1 });
  });

  socket.on("join-game-room-test", () => {
    const room = createGameRoomTest(socket.id);
    socket.join(room.id);
    socket.emit("join-room-success", room);
  });

  socket.on("disconnect", () => {
    const result = removePlayerFromRoom(socket.id);
    if (!result) return;
    const { roomId, players } = result;
    io.to(roomId).emit("wait-room-updated", { players });
  });
});

const PORT = Deno.env.get("PORT") || 5050;

await serve(io.handler(), {
  port: Number(PORT),
});
