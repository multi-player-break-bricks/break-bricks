import { ICollidable, IGameObject, GameObjectType} from "./GameObjectTypes";

export default class playerBoard implements ICollidable, IGameObject {
    name: string;
    img: HTMLImageElement;
    imageHeight: number;
    imageWidth: number;

    playerNumber: number;

    yPos: number;
    xPos: number;
    width: number;
    height: number;
    displayHeight: number;
    displayWidth: number;

    wallMargin: number;

    gameObjectType: GameObjectType;
    gameObject: IGameObject;

    /**
     * @param playerNumber  the player number of the board
     * @param canvas        the canvas that the board will be drawn on
     */
    constructor(playerNumber: number, canvas: HTMLCanvasElement) {
        this.gameObjectType = GameObjectType.player;
        this.img = new Image();
        this.playerNumber = playerNumber;
        this.wallMargin = 10;
        this.gameObject = this;

        //尝试用图片的宽高来控制板子的宽高 但是失败了 所以直接hardcode了， 
        //之后如果要改图片的话，需要重新hardcode 或者找到更好的方法
        //tried to do this.imageWidth = img.naturalWidth; but failed, its value is 0 even though the image element does have naturalWidth
        const boardImageWidth = 360;
        const boardImageHeight = 180;

        if (playerNumber == 1) {
            this.name = "player 1";
            this.height = this.displayHeight = 10;
            this.width = this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = canvas.height - (this.displayHeight + this.wallMargin);

            this.img.src = "./imgs/board.png";
            this.imageWidth = boardImageWidth; 
            this.imageHeight = boardImageHeight;
        }
        else if (playerNumber == 2) {
            this.name = "player 2";
            this.height = this.displayHeight = 50;
            this.width = this.displayWidth = 10;

            this.xPos = 0 + this.wallMargin;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = boardImageHeight;
            this.imageHeight = boardImageWidth;

        }
        else if (playerNumber == 3) {
            this.name = "player 3";
            this.height = this.displayHeight = 10;
            this.width = this.displayWidth = 50;

            this.xPos = canvas.width / 2 - this.displayWidth / 2;
            this.yPos = this.wallMargin;

            this.img.src = "./imgs/board.png";
            this.imageWidth = boardImageWidth;
            this.imageHeight = boardImageHeight;
        }
        else if (playerNumber == 4) {
            this.name = "player 4";
            this.height = this.displayHeight = 50;
            this.width = this.displayWidth = 10;

            this.xPos = canvas.width - this.wallMargin - this.displayWidth;
            this.yPos = canvas.height / 2 - this.displayHeight / 2;

            this.img.src = "./imgs/board_rotated.png";
            this.imageWidth = boardImageHeight;
            this.imageHeight = boardImageWidth;
        }
    }

    drawThis(canvasContext: CanvasRenderingContext2D) {
        canvasContext.drawImage(this.img, 0, 0, this.imageWidth, this.imageHeight, this.xPos, this.yPos, this.displayWidth, this.displayHeight);
    }

    moveTo(direction) {
        if (direction == "top") {
            this.yPos = this.yPos - 1;
        }
        else if (direction == "bottom") {
            this.yPos = this.yPos + 1;
        }
        else if (direction == "left") {
            this.xPos = this.xPos - 1;
        }
        else if (direction == "right") {
            this.xPos = this.xPos + 1;
        }
    };

    isColliding(collidable: ICollidable): boolean {
        if (this.xPos < collidable.gameObject.xPos + collidable.width &&
            this.xPos + this.displayWidth > collidable.gameObject.xPos &&
            this.yPos < collidable.gameObject.yPos + collidable.height &&
            this.yPos + this.displayHeight > collidable.gameObject.yPos) {
            return true;
        }
        return false;
    }

}