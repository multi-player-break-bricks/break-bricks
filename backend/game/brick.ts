import * as GameData from "./GameData.ts";

export default class Brick
  implements GameData.ICollidable, GameData.IGameObject
{
  name: string;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  gameObjectType: GameData.GameObjectType;
  gameObject: GameData.IGameObject;
  collidable: GameData.ICollidable;

  constructor() {
    this.xPos = 0;
    this.yPos = 0;
    this.displayWidth = this.width = GameData.BRICK_WIDTH;
    this.displayHeight = this.height = GameData.BRICK_HEIGHT;
    this.gameObjectType = GameData.GameObjectType.brick;
    this.name = "brick";
    this.gameObject = this;
    this.collidable = this;
  }

  /**
   * @param y y position of the object
   * @param x x position of the object
   */
  setPosition(y: number, x: number) {
    this.xPos = x;
    this.yPos = y;
  }

  // drawThis(canvasContext) {
  //   canvasContext.beginPath();
  //   canvasContext.moveTo(this.yPos, this.yPos);
  //   canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
  //   canvasContext.fill();
  // }
}
