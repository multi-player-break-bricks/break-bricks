import Circle from "./Ball";
import * as GameData from "./GameData";

export default class Brick
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  name: string;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  gameObjectType: GameData.GameObjectType;
  life: number;
  lastCollidedPlayerId: number;

  constructor(life?: number) {
    this.gameID = GameData.generateID();
    this.xPos = 0;
    this.yPos = 0;
    this.displayWidth = this.width = GameData.BRICK_WIDTH;
    this.displayHeight = this.height = GameData.BRICK_HEIGHT;
    this.gameObjectType = GameData.GameObjectType.brick;
    this.name = "brick";
    this.life = life || 1;
    this.lastCollidedPlayerId = -1;
  }

  /**
   * @param y y position of the object
   * @param x x position of the object
   */
  setPosition(y: number, x: number) {
    this.xPos = x;
    this.yPos = y;
  }

  onCollision(collidable: GameData.ICollidable): boolean {
    if (collidable.gameObjectType === GameData.GameObjectType.circle) {
      this.life--;
      this.lastCollidedPlayerId = (<Circle>collidable).lastCollidedPlayerId;
      return true;
    }
    return false;
  }

  // drawThis(canvasContext) {
  //   canvasContext.beginPath();
  //   canvasContext.moveTo(this.yPos, this.yPos);
  //   canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  //   canvasContext.fill();
  // }
}

export { Brick };
