import * as GameData from "./GameData.ts";

export default class PlayerBoard
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  name: string;

  playerNumber: number;

  score: number;

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
  onCollision: (collidable: GameData.ICollidable) => boolean;

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
    this.width = 0;
    this.height = 0;
    this.displayHeight = 0;
    this.displayWidth = 0;
    this.wallMargin = GameData.PLAYER_BOARD_WALL_MARGIN;
    this.isPlayerMovingLeft = false;
    this.isPlayerMovingRight = false;
    this.colliderType = GameData.ColliderType.rect;
    this.radius = 0;
    this.score = 0;

    this.onCollision = () => false;

    if (playerNumber == 1) {
      this.name = "player 1";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_HEIGHT;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_WIDTH;

      //   this.xPos = canvas.width / 2 - this.displayWidth / 2;
      //   this.yPos = canvas.height - (this.displayHeight + this.wallMargin);
    } else if (playerNumber == 2) {
      this.name = "player 2";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_WIDTH;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_HEIGHT;

      //   this.xPos = 0 + this.wallMargin;
      //   this.yPos = canvas.height / 2 - this.displayHeight / 2;
    } else if (playerNumber == 3) {
      this.name = "player 3";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_HEIGHT;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_WIDTH;

      //   this.xPos = canvas.width / 2 - this.displayWidth / 2;
      //   this.yPos = this.wallMargin;
    } else if (playerNumber == 4) {
      this.name = "player 4";
      this.height = this.displayHeight = GameData.PLAYER_BOARD_WIDTH;
      this.width = this.displayWidth = GameData.PLAYER_BOARD_HEIGHT;

      //   this.xPos = canvas.width - this.wallMargin - this.displayWidth;
      //   this.yPos = canvas.height / 2 - this.displayHeight / 2;
    }
  }

  increaseScore(score: number) {
    this.score += score;
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
    //player 1 and 3 is the bottom and top player
    if (this.playerNumber == 1 || this.playerNumber == 3) {
      if (this.xPos < GameData.PLAYER_BOARD_WIDTH) {
        this.xPos = GameData.PLAYER_BOARD_WIDTH;
      } else if (
        this.xPos >
        GameData.GAME_CANVAS_WIDTH -
          GameData.PLAYER_BOARD_WIDTH -
          GameData.PLAYER_BOARD_WIDTH
      ) {
        this.xPos =
          GameData.GAME_CANVAS_WIDTH -
          GameData.PLAYER_BOARD_WIDTH -
          GameData.PLAYER_BOARD_WIDTH;
      }
    }
    //player 2 and 4 is the left and right player
    else if (this.playerNumber == 2 || this.playerNumber == 4) {
      if (this.yPos < GameData.PLAYER_BOARD_WIDTH) {
        this.yPos = GameData.PLAYER_BOARD_WIDTH;
      } else if (
        this.yPos >
        GameData.GAME_CANVAS_HEIGHT -
          GameData.PLAYER_BOARD_WIDTH -
          GameData.PLAYER_BOARD_WIDTH
      ) {
        this.yPos =
          GameData.GAME_CANVAS_HEIGHT -
          GameData.PLAYER_BOARD_WIDTH -
          GameData.PLAYER_BOARD_WIDTH;
      }
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
    if (this.playerNumber == 1 || this.playerNumber == 3) {
      this.displayWidth = this.width = this.width * 1.5;
    } else if (this.playerNumber == 2 || this.playerNumber == 4) {
      this.displayHeight = this.height = this.height * 1.5;
    }
  }
}

export { PlayerBoard };
