import { ICollidable, IGameObject, GameObjectType} from "./GameObjectTypes";

export default class brick implements ICollidable, IGameObject {
    name: string;
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    gameObjectType: GameObjectType;
    gameObject: IGameObject;

    /**
     * @param yPos
     * @param xPos
     * @param width
     * @param height
     */
    constructor(yPos: number, xPos: number, width: number, height: number) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.gameObjectType = GameObjectType.brick;
        this.name = "brick";
        this.gameObject = this;
    }

    drawThis(canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos)
        canvasContext.rect(this.xPos, this.yPos, this.width, this.height);
        canvasContext.fill();
    }

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.width > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.height > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

}