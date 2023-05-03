import { ICollidable, IGameObject, GameObjectType} from "./GameObjectTypes";
import playerBoard from "./PlayerBoard";

export default class circle implements ICollidable, IGameObject {
    name: string;
    xPos: number;
    yPos: number;
    size: number;
    width: number;  
    height: number;
    gameObjectType: GameObjectType;
    movingDirectionX: number;
    movingDirectionY: number;
    gameObject: IGameObject;
    lastCollidedObject: ICollidable;

    /**
     * @param yPos 
     * @param xPos 
     * @param size 
     */
    constructor(yPos:number, xPos:number, size:number) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.size = size;
        this.gameObjectType = GameObjectType.circle;
        this.name = "circle";
        this.width = size*0.75;
        this.height = size*0.75;
        this.movingDirectionX = 0;
        this.movingDirectionY = 0;
        this.gameObject = this;
    }


    SetMovingdirection(yDirection: number, xDirection: number) {
        this.movingDirectionX = xDirection;
        this.movingDirectionY = yDirection;
    }

    drawThis(canvasContext) {
        canvasContext.beginPath();
        canvasContext.moveTo(this.yPos, this.yPos)
        canvasContext.arc(this.xPos, this.yPos, this.size, 0 * Math.PI, 2 * Math.PI);
        canvasContext.fill();
    }

    /**
     * will move according to the moving direction
     */
    move() {
        //if no moving direction is set, do nothing
        if (this.xPos == undefined || this.yPos == undefined || this.movingDirectionX == undefined || this.movingDirectionY == undefined) {
            return;
        }
        this.xPos += this.movingDirectionX;
        this.yPos += this.movingDirectionY;
    }

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos <= collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.width >= collidable.gameObject.xPos &&
            this.yPos <= collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.height >= collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

    collissionHandler(collidable: ICollidable) {
        //make sure not to collide with itself
        if(collidable == this || collidable == this.lastCollidedObject){
            return;
        }

        if (this.isColliding(collidable)) 
        {
            this.lastCollidedObject = collidable;
            if (collidable.gameObjectType == GameObjectType.player) {
                //if the ball is colliding with the player, the ball flying direction will be changed
                //the ball will be flying to the position based on where it collides with the player
                let player = <playerBoard>collidable;

                if(player.name == "player 1" || player.name == "player 3")
                {
                    this.movingDirectionX = ((this.xPos + this.width / 2) - (player.xPos + player.displayWidth / 2)) / (player.width / 2);
                    this.movingDirectionY = -this.movingDirectionY;
                }
                else if(player.name == "player 2" || player.name == "player 4")
                {
                    this.movingDirectionX = -this.movingDirectionX;
                    this.movingDirectionY = ((this.yPos + this.height / 2) - (player.yPos + player.displayHeight / 2)) / (player.height / 2);
                }
                
            }
            else if (collidable.gameObjectType == GameObjectType.circle) // doesnt seem to work that way
            {
                //the ball will change the moving direction based on the x or y axis of the ball it collides with
                this.movingDirectionX = ((this.xPos + this.width / 2) - (collidable.gameObject.xPos + collidable.width / 2)) / (collidable.width / 2);
                this.movingDirectionY = ((this.yPos + this.height / 2) - (collidable.gameObject.yPos + collidable.height / 2)) / (collidable.height / 2);
            }
            else{
                //the ball will flip the moving direction based on the x or y axis it collides with

                //find out which face did this ball hit
                // find the difference between the center of the ball and the center of the colliding object
                let dx = (this.xPos + this.width / 2) - (collidable.gameObject.xPos + collidable.width / 2);
                let dy = (this.yPos + this.height / 2) - (collidable.gameObject.yPos + collidable.height / 2);

                // find the absolute differences between the x and y positions
                let absDx = Math.abs(dx);
                let absDy = Math.abs(dy);

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
            }
        }
    }
}