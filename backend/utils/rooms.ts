import { randomUUID } from "https://deno.land/std@0.134.0/node/crypto.ts";

let lastWaitRoomNumber = 0;

type WaitRoom = {
  number: string;
  id: string;
  isPublic: boolean;
  players: string[];
};

type GameRoom = {
  id: string;
  players: string[];
};

type Player = {
  id: string;
  name: string;
  isReady: boolean;
};

const waitRooms: Record<string, WaitRoom> = {};
const gameRooms: Record<string, GameRoom> = {};
const players: Record<string, Player> = {};

export const savePlayerName = (playerId: string, name: string) => {
  players[playerId] = { id: playerId, name, isReady: false };
};

export const createWaitRoom = (isPublic: boolean, playerId: string) => {
  lastWaitRoomNumber = lastWaitRoomNumber + 1;
  const stringifiedLastWaitRoomNumber = lastWaitRoomNumber
    .toString()
    .padStart(4, "0");
  const roomId = randomUUID();
  waitRooms[roomId] = {
    number: stringifiedLastWaitRoomNumber,
    id: roomId,
    isPublic,
    players: [playerId],
  };
  return { waitRoomNumber: stringifiedLastWaitRoomNumber, roomId };
};

export const joinWaitRoomWithNumber = (
  waitRoomNumber: string,
  playerId: string
) => {
  const waitRoom = Object.values(waitRooms).find(
    (room) => room.number === waitRoomNumber
  );
  if (!waitRoom) {
    return {
      error: "Room not found",
    };
  }
  if (waitRoom.players.length >= 4) {
    return {
      error: "Room is full",
    };
  }
  waitRoom.players.push(playerId);
  return {
    waitRoomId: waitRoom.id,
    players: waitRoom.players.map((playerId) => players[playerId]),
  };
};

export const joinRandomRoom = (playerId: string) => {
  const waitRoom = Object.values(waitRooms).find(
    (room) => room.players.length < 4 && room.isPublic
  );
  if (!waitRoom) {
    const { roomId, waitRoomNumber } = createWaitRoom(true, playerId);
    return {
      roomId,
      waitRoomNumber,
      players: [players[playerId]],
    };
  }
  waitRoom.players.push(playerId);
  return {
    roomId: waitRoom.id,
    waitRoomNumber: waitRoom.number,
    players: waitRoom.players.map((playerId) => players[playerId]),
  };
};

export const findWaitRoom = (waitRoomId: string) => {
  const waitRoom = waitRooms[waitRoomId];
  if (!waitRoom) return;
  return {
    id: waitRoom.id,
    number: waitRoom.number,
    players: waitRoom.players.map((playerId) => players[playerId]),
  };
};

export const removePlayerFromRoom = (playerId: string) => {
  const waitRoom = Object.values(waitRooms).find((room) =>
    room.players.includes(playerId)
  );
  if (waitRoom) {
    waitRoom.players = waitRoom.players.filter((id) => id !== playerId);
    return {
      roomId: waitRoom.id,
      players: waitRoom.players.map((playerId) => players[playerId]),
    };
  }
  const gameRoom = Object.values(gameRooms).find((room) =>
    room.players.includes(playerId)
  );
  if (!gameRoom) return;
  gameRoom.players = gameRoom.players.filter((id) => id !== playerId);
  return {
    roomId: gameRoom.id,
    players: gameRoom.players.map((playerId) => players[playerId]),
  };
};

export const updatePlayerReady = (
  roomNumber: string,
  playerId: string,
  isReady: boolean
) => {
  const waitRoom = Object.values(waitRooms).find(
    (room) => room.number === roomNumber
  );
  if (!waitRoom) return;
  players[playerId].isReady = isReady;
  return {
    roomId: waitRoom.id,
    players: waitRoom.players.map((playerId) => players[playerId]),
  };
};

export const moveWaitRoomToGameRoom = (roomId: string) => {
  const waitRoom = waitRooms[roomId];
  if (!waitRoom) return;
  delete waitRooms[roomId];
  gameRooms[roomId] = {
    id: roomId,
    players: waitRoom.players,
  };
};

export const findGameRoom = (roomId: string) => {
  const gameRoom = gameRooms[roomId];
  if (!gameRoom) return;
  return {
    id: gameRoom.id,
    players: gameRoom.players.map((playerId) => players[playerId]),
  };
};
