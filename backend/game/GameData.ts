//global game data
const BALL_SIZE = 5;
const BALL_SPEED = 2;
const BRICK_HEIGHT = 20;
const BRICK_MAP_HEIGHT = 400;
const BRICK_MAP_WIDTH = 400;
const BRICK_MARGIN = 10;
const BRICK_WIDTH = 20;
const FPS = 60;
const GAME_CANVAS_HEIGHT = 500;
const GAME_CANVAS_WIDTH = 500;
const MAX_BRICK_LIFE = 10;
const MAX_BRICKS_PER_COLUMN = 10;
const MAX_BRICKS_PER_ROW = 10;
const PLAYER_BOARD_HEIGHT = 10;
const PLAYER_BOARD_WALL_MARGIN = 10;
const PLAYER_BOARD_WIDTH = 50;
const PLAYER_MOVE_SPEED = 3;
const REWARD_HEIGHT = 10;
const REWARD_PROBABILITY = 0.2;
const REWARD_WIDTH = 10;
let CURRENT_GAME_ID = 0;

/**
 * use this enum to identify game objects
 *
 * @enum GameObjectType enum for all game objects
 */
enum GameObjectType {
  circle,
  player,
  brick,
  wall,
  reward,
}

enum ColliderType {
  rect,
  circle,
}

/**
 * basic game object interface
 * @field name name of the object
 * @field xPos x position of the object
 * @field yPos y position of the object
 */
interface IGameObject {
  gameID: number;
  name: string;
  xPos: number;
  yPos: number;
  displayWidth: number;
  displayHeight: number;
}

/**
 * @interface ICollidable
 * @description interface for all collidable objects, its hard to do collision with all kinda shapes,
 *              so we will use rectangle for all collidable objects
 */
interface ICollidable {
  gameID: number;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  gameObjectType: GameObjectType;
  colliderType: ColliderType;
  radius: number;

  /**
   * @param collidable the object with which this object is colliding
   * @returns true if object is changing its state after collision, false otherwise
   */
  onCollision: (collidable: ICollidable) => boolean;
}

/**
 * @class ColliderUtil class for collision detection
 * @description this class will have all the methods for collision detection
 */
class ColliderUtil {
  /**
   * @method isColliding
   * @description this method will check if two rect collidable objects are colliding or not
   *
   * @param collidable1 first collidable object
   * @param collidable2 second collidable object
   *
   * @returns true if colliding, false otherwise
   */
  static isColliding(
    collidable1: ICollidable,
    collidable2: ICollidable
  ): boolean {
    if (
      collidable1.colliderType === ColliderType.rect &&
      collidable2.colliderType === ColliderType.rect
    ) {
      // Rectangle to Rectangle collision
      return (
        collidable1.xPos < collidable2.xPos + collidable2.width &&
        collidable1.xPos + collidable1.width > collidable2.xPos &&
        collidable1.yPos < collidable2.yPos + collidable2.height &&
        collidable1.yPos + collidable1.height > collidable2.yPos
      );
    } else if (
      collidable1.colliderType === ColliderType.circle &&
      collidable2.colliderType === ColliderType.circle
    ) {
      // Circle to Circle collision
      const dx = collidable1.xPos - collidable2.xPos;
      const dy = collidable1.yPos - collidable2.yPos;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < collidable1.radius + collidable2.radius;
    } else {
      // Rectangle to Circle collision
      const rect =
        collidable1.colliderType === ColliderType.rect
          ? collidable1
          : collidable2;
      const circle =
        collidable1.colliderType === ColliderType.circle
          ? collidable1
          : collidable2;

      let testX = circle.xPos;
      let testY = circle.yPos;

      if (circle.xPos < rect.xPos) {
        testX = rect.xPos;
      } else if (circle.xPos > rect.xPos + rect.width) {
        testX = rect.xPos + rect.width;
      }

      if (circle.yPos < rect.yPos) {
        testY = rect.yPos;
      } else if (circle.yPos > rect.yPos + rect.height) {
        testY = rect.yPos + rect.height;
      }

      const dx = circle.xPos - testX;
      const dy = circle.yPos - testY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance < circle.radius;
    }
  }
}

function generateID(): number {
  return CURRENT_GAME_ID++;
}

//functions
export { GameObjectType, ColliderUtil, generateID, ColliderType };

//type
export type { IGameObject, ICollidable };

//data
export {
  BALL_SIZE,
  BALL_SPEED,
  BRICK_HEIGHT,
  BRICK_MAP_HEIGHT,
  BRICK_MAP_WIDTH,
  BRICK_MARGIN,
  BRICK_WIDTH,
  CURRENT_GAME_ID,
  FPS,
  GAME_CANVAS_HEIGHT,
  GAME_CANVAS_WIDTH,
  MAX_BRICK_LIFE,
  MAX_BRICKS_PER_COLUMN,
  MAX_BRICKS_PER_ROW,
  PLAYER_BOARD_HEIGHT,
  PLAYER_BOARD_WALL_MARGIN,
  PLAYER_BOARD_WIDTH,
  PLAYER_MOVE_SPEED,
  REWARD_HEIGHT,
  REWARD_PROBABILITY,
  REWARD_WIDTH,
};
