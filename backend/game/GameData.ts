//global game data
const GAME_CANVAS_WIDTH = 500;
const GAME_CANVAS_HEIGHT = 500;
const BALL_SIZE = 10;
const PLAYER_BOARD_WIDTH = 50;
const PLAYER_BOARD_HEIGHT = 10;
const PLAYER_BOARD_WALL_MARGIN = 10;
const PLAYER_MOVE_SPEED = 1;
const BRICK_WIDTH = 25;
const BRICK_HEIGHT = 25;

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
}

/**
 * basic game object interface
 * @field name name of the object
 * @field xPos x position of the object
 * @field yPos y position of the object
 */
interface IGameObject {
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
  width: number;
  height: number;
  gameObjectType: GameObjectType;
  gameObject: IGameObject;
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
      collidable1.gameObject.xPos <
        collidable2.gameObject.xPos + collidable2.width &&
      collidable1.gameObject.xPos + collidable1.width >
        collidable2.gameObject.xPos &&
      collidable1.gameObject.yPos <
        collidable2.gameObject.yPos + collidable2.height &&
      collidable1.gameObject.yPos + collidable1.height >
        collidable2.gameObject.yPos
    ) {
      return true;
    }
    return false;
  }
}

//functions
export { GameObjectType, ColliderUtil };

//type
export type { IGameObject, ICollidable };

//data
export {
  GAME_CANVAS_WIDTH,
  GAME_CANVAS_HEIGHT,
  BALL_SIZE,
  PLAYER_BOARD_WIDTH,
  PLAYER_BOARD_HEIGHT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  PLAYER_MOVE_SPEED,
  PLAYER_BOARD_WALL_MARGIN,
};
