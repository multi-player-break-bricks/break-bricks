import {
  randomUUID,
  createHash,
} from "https://deno.land/std@0.134.0/node/crypto.ts";
import GameInstance from "../game/GameInstance.ts";

type WaitRoom = {
  number: string;
  id: string;
  isPublic: boolean;
  players: string[];
};

type GameRoom = {
  id: string;
  gameInstance: GameInstance;
  players: string[];
};

type Player = {
  id: string;
  name: string;
  number: number;
  isReady: boolean;
};

const waitRooms: Record<string, WaitRoom> = {};
const gameRooms: Record<string, GameRoom> = {};
const players: Record<string, Player> = {};

const hash = createHash("sha1");

const getRoomNumber = (id: string) => {
  hash.update(id);
  let roomNumber = parseInt(hash.digest("hex").toString(), 16) % 10000;
  while (roomNumber.toString().padStart(4, "0") in waitRooms) {
    roomNumber = (roomNumber + 1) % 10000;
  }
  return roomNumber.toString().padStart(4, "0");
};

const savePlayerInfo = (playerId: string, name: string, number: number) => {
  players[playerId] = { id: playerId, name, number, isReady: false };
};

export const getPlayerInfo = (playerId: string) => {
  return players[playerId];
};

export const createWaitRoom = (
  isPublic: boolean,
  playerId: string,
  playerName: string
) => {
  const roomId = randomUUID();
  const stringifiedLastWaitRoomNumber = getRoomNumber(roomId);
  waitRooms[roomId] = {
    number: stringifiedLastWaitRoomNumber,
    id: roomId,
    isPublic,
    players: [playerId],
  };
  savePlayerInfo(playerId, playerName, 1);
  return { waitRoomNumber: stringifiedLastWaitRoomNumber, roomId };
};

export const joinWaitRoomWithNumber = (
  waitRoomNumber: string,
  playerId: string,
  playerName: string
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
  savePlayerInfo(playerId, playerName, waitRoom.players.length);
  return {
    waitRoomId: waitRoom.id,
    players: waitRoom.players.map((playerId) => players[playerId]),
  };
};

export const joinRandomRoom = (playerId: string, playerName: string) => {
  const waitRoom = Object.values(waitRooms).find(
    (room) => room.players.length < 4 && room.isPublic
  );
  if (!waitRoom) {
    const { roomId, waitRoomNumber } = createWaitRoom(
      true,
      playerId,
      playerName
    );
    return {
      roomId,
      waitRoomNumber,
      players: [players[playerId]],
    };
  }
  waitRoom.players.push(playerId);
  savePlayerInfo(playerId, playerName, waitRoom.players.length);
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
  delete players[playerId];
  if (waitRoom) {
    waitRoom.players = waitRoom.players.filter((id) => id !== playerId);
    waitRoom.players.forEach((playerId) => {
      players[playerId].number = waitRoom.players.indexOf(playerId) + 1;
    });
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

export const findGameRoom = (roomId: string) => {
  const gameRoom = gameRooms[roomId];
  if (!gameRoom) return;
  return {
    ...gameRoom,
    players: gameRoom.players.map((playerId) => players[playerId]),
  };
};

export const initializeGameRoom = (roomId: string) => {
  const waitRoom = waitRooms[roomId];
  if (waitRoom) {
    delete waitRooms[roomId];
    gameRooms[roomId] = {
      id: roomId,
      gameInstance: new GameInstance(roomId, waitRoom.players.length),
      players: waitRoom.players,
    };
  }

  const gameRoom = gameRooms[roomId];
  const { bouncers, balls, bricks } = getGameInfo(gameRoom);

  const bouncersWithId = bouncers.map(
    (bouncer: Record<string, number>, index: number) => ({
      ...bouncer,
      id: gameRoom.players[index],
    })
  );

  return {
    id: gameRoom.id,
    gameInfo: { bouncers: bouncersWithId, balls, bricks },
    players: gameRoom.players.map((playerId) => players[playerId]),
  };
};

export const getGameInfo = (gameRoom: GameRoom) => {
  const { gameInstance } = gameRoom;
  const bouncers = gameInstance.getCurrentBouncerInfo();
  const balls = gameInstance.getCurrentBallInfo();
  const bricks = gameInstance.getCurrentBrickInfo();
  const rewards = gameInstance.getCurrentRewardInfo();
  return { bouncers, balls, bricks, rewards };
};

export const moveBouncer = (
  direction: "left" | "right",
  pressed: boolean,
  roomId: string,
  playerId: string
) => {
  const gameRoom = gameRooms[roomId];
  if (!gameRoom) throw new Error("Game room not found");
  const { number } = players[playerId];
  gameRoom.gameInstance.setPlayerDir(number, direction, pressed);
};

export const createGameRoomTest = (playerId: string) => {
  let gameRoom = gameRooms["test"];
  if (!gameRoom) {
    gameRooms["test"] = {
      id: "test",
      players: [playerId],
      gameInstance: new GameInstance("test", 1),
    };
    gameRoom = gameRooms["test"];
  }
  players[playerId] = {
    id: playerId,
    name: "test",
    number: 1,
    isReady: true,
  };
  const { bouncers, balls, bricks } = getGameInfo(gameRoom);

  return {
    id: gameRoom.id,
    gameInfo: { bouncers: [{ ...bouncers[0], id: playerId }], balls, bricks },
    players: gameRoom.players.map((playerId) => players[playerId]),
  };
};
