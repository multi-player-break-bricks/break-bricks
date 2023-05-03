enum GameObjectType {
    circle,
    player,
    brick,
    wall
}

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

export { GameObjectType, IGameObject, ICollidable}