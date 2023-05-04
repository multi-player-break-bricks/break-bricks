//global game data
export const GAME_CANVAS_WIDTH = 500;
export const GAME_CANVAS_HEIGHT = 500;

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
  isColliding(collidable: ICollidable): boolean;
  gameObject: IGameObject;
}

export { GameObjectType, IGameObject, ICollidable };
