import * as GameData from "./GameData.ts";
import playerBoard from "./PlayerBoard.ts";

export default class Circle
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  name: string;
  xPos: number;
  yPos: number;
  size: number;
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
  gameObjectType: GameData.GameObjectType;
  movingDirectionX: number;
  movingDirectionY: number;
  lastCollidedObjectId: number;
  lastCollidedPlayerId: number;

  /**
   * @param yPos
   * @param xPos
   * @param size
   */
  constructor(size: number) {
    this.gameID = GameData.generateID();
    this.xPos = 0;
    this.yPos = 0;
    this.size = size;
    this.gameObjectType = GameData.GameObjectType.circle;
    this.name = "circle";
    this.displayWidth = this.width = size * 0.8;
    this.displayHeight = this.height = size * 0.8;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    this.lastCollidedObjectId = -1;
    this.lastCollidedPlayerId = -1;
  }

  setPosition(yPos: number, xPos: number) {
    this.xPos = xPos;
    this.yPos = yPos;
  }

  SetMovingdirection(yDirection: number, xDirection: number) {
    this.movingDirectionX = xDirection;
    this.movingDirectionY = yDirection;
  }

  // drawThis(canvasContext) {
  //   canvasContext.beginPath();
  //   canvasContext.moveTo(this.yPos, this.yPos);
  //   canvasContext.arc(
  //     this.xPos,
  //     this.yPos,
  //     this.size,
  //     0 * Math.PI,
  //     2 * Math.PI
  //   );
  //   canvasContext.fill();}

  /**
   * will move according to the moving direction
   */
  move(): void {
    //if no moving direction is set, do nothing
    if (
      this.xPos == undefined ||
      this.yPos == undefined ||
      this.movingDirectionX == undefined ||
      this.movingDirectionY == undefined
    ) {
      throw new Error("moving direction or position not set");
      return;
    }

    this.xPos += this.movingDirectionX * GameData.BALL_SPEED;
    this.yPos += this.movingDirectionY * GameData.BALL_SPEED;
  }

  /**
   * @param collidable the object to check collision with
   * @returns true if the object is colliding with the collidable object
   *          and the colliding object will change state accordingly
   */
  onCollision(collidable: GameData.ICollidable): boolean {
    //make sure not to collide with itself
    if (collidable == this || collidable.gameID == this.lastCollidedObjectId) {
      return false;
    }

    this.lastCollidedObjectId = collidable.gameID;

    if (collidable.gameObjectType == GameData.GameObjectType.player) {
      //if the ball is colliding with the player, the ball flying direction will be changed
      //the ball will be flying to the position based on where it collides with the player
      const player = <playerBoard>collidable;
      this.lastCollidedPlayerId = player.gameID;

      if (player.name == "player 1" || player.name == "player 3") {
        this.movingDirectionX =
          (this.xPos +
            this.width / 2 -
            (player.xPos + player.displayWidth / 2)) /
          (player.width / 2);
        this.movingDirectionY = -this.movingDirectionY;
      } else if (player.name == "player 2" || player.name == "player 4") {
        this.movingDirectionX = -this.movingDirectionX;
        this.movingDirectionY =
          (this.yPos +
            this.height / 2 -
            (player.yPos + player.displayHeight / 2)) /
          (player.height / 2);
      }

      return true;
    } else if (collidable.gameObjectType == GameData.GameObjectType.circle) {
      //the ball will change the moving direction based on the x or y axis of the ball it collides with
      this.movingDirectionX =
        (this.xPos +
          this.width / 2 -
          (collidable.xPos + collidable.width / 2)) /
        (collidable.width / 2);
      this.movingDirectionY =
        (this.yPos +
          this.height / 2 -
          (collidable.yPos + collidable.height / 2)) /
        (collidable.height / 2);

      return true;
    } else if (collidable.gameObjectType == GameData.GameObjectType.brick) {
      //the ball will flip the moving direction based on the x or y axis it collides with

      //find out which face did this ball hit
      // find the difference between the center of the ball and the center of the colliding object
      const dx =
        this.xPos + this.width / 2 - (collidable.xPos + collidable.width / 2);
      const dy =
        this.yPos + this.height / 2 - (collidable.yPos + collidable.height / 2);

      // find the absolute differences between the x and y positions
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // check which face the ball hit based on which absolute difference is larger
      if (absDx > absDy) {
        // ball hit either left or right face of colliding object
        if (dx < 0) {
          // ball hit right face of colliding object
          this.movingDirectionX = -this.movingDirectionX;
        } else {
          // ball hit left face of colliding object
          this.movingDirectionX = Math.abs(this.movingDirectionX);
        }
      } else {
        // ball hit either top or bottom face of colliding object
        if (dy < 0) {
          // ball hit bottom face of colliding object
          this.movingDirectionY = -this.movingDirectionY;
        } else {
          // ball hit top face of colliding object
          this.movingDirectionY = Math.abs(this.movingDirectionY);
        }
      }

      return true;
    }

    return false;
  }

  /**
   * use this function for reward bigger ball
   */
  biggerBall() {
    this.size *= 1.5;
    this.displayWidth = this.width = this.size * 0.8;
    this.displayHeight = this.height = this.size * 0.8;
  }
}

export { Circle };
