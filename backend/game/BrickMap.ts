import Brick from "./Brick.ts";
import * as GameData from "./GameData.ts";

export default interface BrickMap {
  //10 rows and 10 columns
  map: Brick[][];
}

export function generateBrickMap(): BrickMap {
  const map: Brick[][] = [];
  //row
  for (let i = 0; i < GameData.MAX_BRICKS_PER_ROW; i++) {
    map.push([]);
    //column
    for (let j = 0; j < GameData.MAX_BRICKS_PER_COLUMN; j++) {
      const random = Math.floor(Math.random() * GameData.MAX_BRICK_LIFE);
      map[i].push(new Brick(random));
    }
  }

  return { map };
}
