import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { FRAME_RATE_SERVER } from "./game/GameData.ts";

import {
  createWaitRoom,
  joinWaitRoomWithNumber,
  joinRandomRoom,
  findWaitRoom,
  removePlayerFromRoom,
  updatePlayerReady,
  initializeGameRoom,
  moveBouncer,
  setPlayerInGame,
  canInitializeGameRoom,
  getGameInfoUpdates,
  returnToWaitRoomWithId,
} from "./utils/rooms.ts";

const developmentUrl = "http://localhost:3000";
const productionUrl = "https://brick-breaking.vercel.app";

let countdownInterval: number;

const io = new Server({
  cors: {
    origin: [developmentUrl, productionUrl],
  },
});

io.on("connection", (socket) => {
  socket.on("create-wait-room", ({ isPublic, name }) => {
    const { roomId } = createWaitRoom(isPublic, socket.id, name);
    socket.join(roomId);
    socket.emit("join-wait-room");
  });

  socket.on("join-wait-room-with-id", ({ roomNumber, name }) => {
    const result = joinWaitRoomWithNumber(roomNumber, socket.id, name);
    if (result.error) {
      socket.emit("join-wait-room-error", result.error);
      return;
    }
    const { waitRoomId, players } = result;
    if (!players) {
      socket.emit("join-wait-room-error", "No players found");
      return;
    }
    socket.join(waitRoomId!);
    socket.emit("join-wait-room");
  });

  socket.on("join-random-wait-room", (name) => {
    const { roomId } = joinRandomRoom(socket.id, name);
    socket.join(roomId);
    socket.emit("join-wait-room");
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
    io.to(roomId).emit("wait-room-updated", waitRoom.players);
  });

  socket.on("update-player-ready", ({ roomId, isReady }) => {
    const players = updatePlayerReady(roomId, socket.id, isReady);
    if (!players) return;
    io.to(roomId).emit("wait-room-updated", players);
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
    setPlayerInGame(socket.id);
    const allPlayersReady = canInitializeGameRoom(roomId.toString());
    if (allPlayersReady) {
      const gameRoom = initializeGameRoom(roomId.toString());
      io.to(roomId).emit("join-room-success", gameRoom);
    }
  });

  socket.on("request-game-info", (roomId) => {
    try {
      const updateInterval = setInterval(() => {
        const gameInfo = getGameInfoUpdates(roomId.toString());
        if (gameInfo.gameStatus.status !== "game running") {
          clearInterval(updateInterval);
        }
        socket.emit("frame-change", gameInfo);
      }, 1000 / FRAME_RATE_SERVER);
    } catch (error) {
      socket.emit("join-room-error", error);
    }
  });

  socket.on("move-bouncer", ({ direction, pressed }) => {
    const roomId = [...socket.rooms].find((room) => room !== socket.id);
    if (!roomId) {
      socket.emit("join-room-error", "Room not found");
      return;
    }
    moveBouncer(direction, pressed, roomId.toString(), socket.id);
  });

  socket.on("return-to-wait-room", (roomId) => {
    returnToWaitRoomWithId(roomId, socket.id);
  });

  socket.on("disconnect", () => {
    const result = removePlayerFromRoom(socket.id);
    if (!result) return;
    const { isWaitRoom, roomId, players } = result;
    if (isWaitRoom) {
      io.to(roomId).emit("wait-room-updated", players);
    } else {
      io.to(roomId).emit("player-left", players);
    }
  });
});

const PORT = Deno.env.get("PORT") || 5050;

await serve(io.handler(), {
  port: Number(PORT),
});
