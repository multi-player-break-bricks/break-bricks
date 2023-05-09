import * as GameData from "./GameData.ts";

export default class Wall
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
  wallNumber: number;

  /**
   * @param playerNumber take originla player number to determine
   *                      which position to place the wall
   */
  constructor(playerNumber: number) {
    if (playerNumber > 4) {
      throw new Error("Player number must be between 1 and 4");
    }
    this.gameID = GameData.generateID();
    this.xPos = 0;
    this.yPos = 0;
    this.displayWidth = -1;
    this.displayHeight = -1;
    this.gameObjectType = GameData.GameObjectType.wall;
    this.colliderType = GameData.ColliderType.rect;
    this.radius = -1;
    this.onCollision = () => false;
    this.name = "wall";
    this.width = 0;
    this.height = 0;
    this.wallNumber = playerNumber;

    switch (playerNumber) {
      case 1:
        this.xPos = 0;
        this.yPos =
          GameData.GAME_CANVAS_HEIGHT - GameData.PLAYER_BOARD_WALL_MARGIN;
        this.displayWidth = this.width = GameData.GAME_CANVAS_WIDTH;
        this.displayHeight = this.height = GameData.PLAYER_BOARD_WALL_MARGIN;
        break;
      case 2:
        this.xPos = 0;
        this.yPos = 0;
        this.displayWidth = this.width = GameData.PLAYER_BOARD_WALL_MARGIN;
        this.displayHeight = this.height = GameData.GAME_CANVAS_HEIGHT;
        break;
      case 3:
        this.xPos = 0;
        this.yPos = 0;
        this.displayWidth = this.width = GameData.GAME_CANVAS_WIDTH;
        this.displayHeight = this.height = GameData.PLAYER_BOARD_WALL_MARGIN;
        break;
      case 4:
        this.xPos =
          GameData.GAME_CANVAS_WIDTH - GameData.PLAYER_BOARD_WALL_MARGIN;
        this.yPos = 0;
        this.displayWidth = this.width = GameData.PLAYER_BOARD_WALL_MARGIN;
        this.displayHeight = this.height = GameData.GAME_CANVAS_HEIGHT;
        break;

      default:
        throw new Error("Player number must be between 1 and 4");
        break;
    }
  }
}
