import * as GameData from "./GameData.ts";

export default class BlockingObject
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  gameObjectType: GameData.GameObjectType;
  colliderType: GameData.ColliderType;
  radius: number;
  onCollision: (collidable: GameData.ICollidable) => boolean;
  name: string;
  displayWidth: number;
  displayHeight: number;

  constructor(xPos: number, yPos: number, width: number, height: number) {
    this.gameID = GameData.generateID();
    this.xPos = xPos;
    this.yPos = yPos;
    this.displayWidth = this.width = width;
    this.displayHeight = this.height = height;
    this.gameObjectType = GameData.GameObjectType.blockingObject;
    this.name = "blockingObject";
    this.colliderType = GameData.ColliderType.rect;
    this.radius = 0;
    this.onCollision = () => false;
  }
}
