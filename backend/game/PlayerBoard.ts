import * as GameData from "./GameData.ts";

export default class PlayerBoard
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  name: string;
  imageHeight: number;
  imageWidth: number;

  playerNumber: number;

  yPos: number;
  xPos: number;
  width: number;
  height: number;
  displayHeight: number;
  displayWidth: number;
  radius: number;

  isPlayerMovingLeft: boolean;
  isPlayerMovingRight: boolean;

  wallMargin: number;

  gameObjectType: GameData.GameObjectType;
  colliderType: GameData.ColliderType;

  /**
   * @param playerNumber  the player number of the board, can only be 1-4
   * @param canvas        the canvas that the board will be drawn on
   */
  constructor(playerNumber: number) {
    this.gameID = GameData.generateID();
    //player number can only be 1-4
    if (playerNumber < 1 || playerNumber > 4) {
      throw new Error("player number can only be 1-4");
    }

    this.name = "player";
    this.gameObjectType = GameData.GameObjectType.player;
    this.playerNumber = playerNumber;
    this.xPos = 0;
    this.yPos = 0;
    this.imageHeight = 0;
    this.imageWidth = 0;
    this.width = 0;
    this.height = 0;
    this.displayHeight = 0;
    this.displayWidth = 0;
    this.wallMargin = GameData.PLAYER_BOARD_WALL_MARGIN;
    this.isPlayerMovingLeft = false;
    this.isPlayerMovingRight = false;
    this.colliderType = GameData.ColliderType.rect;
    this.radius = 0;

    //尝试用图片的宽高来控制板子的宽高 但是失败了 所以直接hardcode了，
    //之后如果要改图片的话，需要重新hardcode 或者找到更好的方法
    //tried to do this.imageWidth = img.naturalWidth; but failed, its value is 0 even though the image element does have naturalWidth
    const boardImageWidth = 360;
    const boardImageHeight = 180;

    if (playerNumber == 1) {
      this.name = "player 1";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_HEIGHT;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_WIDTH;

      //   this.xPos = canvas.width / 2 - this.displayWidth / 2;
      //   this.yPos = canvas.height - (this.displayHeight + this.wallMargin);

      this.imageWidth = boardImageWidth;
      this.imageHeight = boardImageHeight;
    } else if (playerNumber == 2) {
      this.name = "player 2";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_WIDTH;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_HEIGHT;

      //   this.xPos = 0 + this.wallMargin;
      //   this.yPos = canvas.height / 2 - this.displayHeight / 2;

      this.imageWidth = boardImageHeight;
      this.imageHeight = boardImageWidth;
    } else if (playerNumber == 3) {
      this.name = "player 3";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_HEIGHT;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_WIDTH;

      //   this.xPos = canvas.width / 2 - this.displayWidth / 2;
      //   this.yPos = this.wallMargin;

      this.imageWidth = boardImageWidth;
      this.imageHeight = boardImageHeight;
    } else if (playerNumber == 4) {
      this.name = "player 4";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_WIDTH;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_HEIGHT;

      //   this.xPos = canvas.width - this.wallMargin - this.displayWidth;
      //   this.yPos = canvas.height / 2 - this.displayHeight / 2;

      this.imageWidth = boardImageHeight;
      this.imageHeight = boardImageWidth;
    }
  }

  onCollision(collidable: GameData.ICollidable): boolean {
    return false;
  }

  setPosition(xPos: number, yPos: number) {
    this.xPos = xPos;
    this.yPos = yPos;
  }

  moveTo(direction: string) {
    if (direction == "top") {
      this.yPos = this.yPos - GameData.PLAYER_MOVE_SPEED;
    } else if (direction == "bottom") {
      this.yPos = this.yPos + GameData.PLAYER_MOVE_SPEED;
    } else if (direction == "left") {
      this.xPos = this.xPos - GameData.PLAYER_MOVE_SPEED;
    } else if (direction == "right") {
      this.xPos = this.xPos + GameData.PLAYER_MOVE_SPEED;
    }

    //restrict the player from moving out of the board
    if (this.yPos < this.wallMargin) {
      this.yPos = this.wallMargin;
    }
    if (
      this.yPos >
      GameData.GAME_CANVAS_HEIGHT - this.displayHeight - this.wallMargin
    ) {
      this.yPos =
        GameData.GAME_CANVAS_HEIGHT - this.displayHeight - this.wallMargin;
    }
    if (this.xPos < this.wallMargin) {
      this.xPos = this.wallMargin;
    }
    if (
      this.xPos >
      GameData.GAME_CANVAS_WIDTH - this.displayWidth - this.wallMargin
    ) {
      this.xPos =
        GameData.GAME_CANVAS_WIDTH - this.displayWidth - this.wallMargin;
    }
  }

  /**
   * move player based on the player number and the direction
   *
   */
  move() {
    if (this.playerNumber == 1) {
      //player 1 is the bottom player
      if (this.isPlayerMovingLeft) {
        this.moveTo("left");
      }
      if (this.isPlayerMovingRight) {
        this.moveTo("right");
      }
    } else if (this.playerNumber == 2) {
      //player 2 is the left player
      if (this.isPlayerMovingLeft) {
        this.moveTo("top");
      }
      if (this.isPlayerMovingRight) {
        this.moveTo("bottom");
      }
    } else if (this.playerNumber == 3) {
      //player 3 is the top player
      if (this.isPlayerMovingLeft) {
        this.moveTo("right");
      }
      if (this.isPlayerMovingRight) {
        this.moveTo("left");
      }
    } else if (this.playerNumber == 4) {
      //player 4 is the right player
      if (this.isPlayerMovingLeft) {
        this.moveTo("bottom");
      }
      if (this.isPlayerMovingRight) {
        this.moveTo("top");
      }
    }
  }

  playerStartMovingLeft() {
    this.isPlayerMovingLeft = true;
  }

  playerStartMovingRight() {
    this.isPlayerMovingRight = true;
  }

  playerStopMovingLeft() {
    this.isPlayerMovingLeft = false;
  }

  playerStopMovingRight() {
    this.isPlayerMovingRight = false;
  }

  /**
   * use this method to make the paddle bigger
   * when consuming reward
   */
  biggerPadddle() {
    this.displayWidth = this.width = this.width * 1.5;
  }
}

export { PlayerBoard };
