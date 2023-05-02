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

const waitRooms: Record<string, WaitRoom> = {};
const gameRooms: Record<string, GameRoom> = {};
const players: Record<string, string> = {};

export const savePlayerName = (playerId: string, name: string) => {
  players[playerId] = name;
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
    (room) => room.players.length < 4
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

export const moveWaitRoomToGameRoom = (
  waitRoomId: string,
  gameRoomId: string
) => {
  const waitRoom = waitRooms[Number(waitRoomId)];
  if (!waitRoom) return;
  delete waitRooms[Number(waitRoomId)];
  gameRooms[gameRoomId] = {
    id: gameRoomId,
    players: waitRoom.players,
  };
};
