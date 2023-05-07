import Ball from "./Ball.ts";
import PlayerBoard from "./PlayerBoard.ts";
import * as GameData from "./GameData.ts";
import Brick from "./Brick.ts";
import Reward, { RewardType } from "./Reward.ts";

export default class GameInstance {
  gameRoomId: string;
  gameObjects: Array<any>;
  gameColliders: Array<GameData.ICollidable>;

  playersMap: Map<number, PlayerBoard>;
  player1: PlayerBoard;
  player2: PlayerBoard;
  player3: PlayerBoard;
  player4: PlayerBoard;

  ballArray: Array<Ball>;

  bricks: Array<Brick>;

  rewards: Array<Reward>;

  /**
   * @description initialize game
   *              start game loop
   *              send gameTransferData to client every frame
   *
   * @param gameRoomId        id of the game room
   * @param CALLBACK_FUNCTION callback function to send gameTransferData to client, see {@link Callback}
   */
  constructor(gameRoomId: string, CALLBACK_FUNCTION?: any) {
    //initialize game
    this.Callback = CALLBACK_FUNCTION;
    this.gameObjects = new Array<any>();
    this.gameRoomId = gameRoomId;
    this.gameColliders = new Array<GameData.ICollidable>();
    this.playersMap = new Map<number, PlayerBoard>();
    this.ballArray = new Array<Ball>();
    this.bricks = new Array<Brick>();
    this.rewards = new Array<Reward>();

    //initialize player
    this.player1 = this.newPlayer(1);
    this.player2 = this.newPlayer(2);
    this.player3 = this.newPlayer(3);
    this.player4 = this.newPlayer(4);

    const player1PosX =
      GameData.GAME_CANVAS_WIDTH / 2 - this.player1.displayWidth / 2;
    const player1PosY =
      GameData.GAME_CANVAS_WIDTH -
      (this.player1.displayHeight + this.player1.wallMargin);
    this.player1.setPosition(player1PosX, player1PosY);

    const player2PosX = 0 + this.player2.wallMargin;
    const player2PosY =
      GameData.GAME_CANVAS_HEIGHT / 2 - this.player2.displayHeight / 2;
    this.player2.setPosition(player2PosX, player2PosY);

    const player3PosX =
      GameData.GAME_CANVAS_WIDTH / 2 - this.player3.displayWidth / 2;
    const player3PosY = 0 + this.player3.wallMargin;
    this.player3.setPosition(player3PosX, player3PosY);

    const player4PosX =
      GameData.GAME_CANVAS_WIDTH -
      (this.player4.displayWidth + this.player4.wallMargin);
    const player4PosY =
      GameData.GAME_CANVAS_HEIGHT / 2 - this.player4.displayHeight / 2;
    this.player4.setPosition(player4PosX, player4PosY);

    //initialize ball
    let ball = this.newBall();
    ball.setPosition(
      GameData.GAME_CANVAS_WIDTH / 2,
      GameData.GAME_CANVAS_HEIGHT / 2
    );

    //initialize bricks
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 5; j++) {
        let brick = this.newBrick();
        //set brick position and margin
        brick.setPosition(
          GameData.GAME_CANVAS_WIDTH -
            GameData.BRICK_MAP_WIDTH +
            i * (brick.displayWidth + GameData.BRICK_MARGIN) +
            GameData.BRICK_MARGIN,
          GameData.GAME_CANVAS_HEIGHT -
            GameData.BRICK_MAP_HEIGHT +
            j * (brick.displayHeight + GameData.BRICK_MARGIN) +
            GameData.BRICK_MARGIN
        );
      }
    }

    //test initalization
    ball.SetMovingdirection(1, 0);

    //start game loop
    setInterval(() => {
      this.Callback(this.Update());
    }, 1000 / GameData.FPS);
  }

  /**
   * !!!IMPORTANT!!!
   * replace this function with a callback function that
   * sends gameTransferData to client
   *
   * @param gameTransferData data received from every update
   */
  Callback(gameTransferData: Object) {
    //send gameTransferData to client
  }

  /**
   * what this game do every frame
   * @returns gameTransferData to send to client
   */
  Update(): Object {
    let updatedGameObject = Array<GameData.ICollidable>();
    //instantiate json string to send to client
    let gameTransferData = {
      player1: this.player1,
      player2: this.player2,
      player3: this.player3,
      player4: this.player4,
      balls: this.ballArray,
      bricks: this.bricks,
      rewards: this.rewards,
    };

    //update player position
    this.player1.move();
    this.player2.move();
    this.player3.move();
    this.player4.move();

    //update ball position
    this.ballArray.forEach((ball) => {
      ball.move();
    });

    //update reward position
    this.rewards.forEach((reward) => {
      reward.move();
    });

    //check collision, if object state changed, update gameTransferData
    this.gameColliders.forEach((gameObject) => {
      this.gameColliders.forEach((gameObject2) => {
        if (gameObject != gameObject2) {
          if (GameData.ColliderUtil.isColliding(gameObject, gameObject2)) {
            if (gameObject.onCollision(gameObject2)) {
              updatedGameObject.push(gameObject);
            }
          }
        }
      });
    });

    updatedGameObject.forEach((gameObject) => {
      if (gameObject instanceof Brick) {
        let brick = <Brick>gameObject;
        if (brick.life <= 0) {
          this.removeBrick(brick);
        }
      } else if (gameObject instanceof Reward) {
        let reward = <Reward>gameObject;

        if (reward.rewardType == RewardType.BiggerPaddle) {
          this.getPlayerByGameId(reward.rewardPlayerId).biggerPadddle();
        } else if (reward.rewardType == RewardType.biggerBall) {
          this.ballArray.forEach((ball) => {
            ball.biggerBall();
          });
        } else if (reward.rewardType == RewardType.extraBall) {
          let ballArrayCopy = [...this.ballArray];
          ballArrayCopy.forEach((ball) => {
            let newB = this.newBall();
            //generate ramdom number with range [-1,1] for both x and y
            let x = Math.random() * 2 - 1;
            let y = Math.random() * 2 - 1;
            newB.setPosition(ball.yPos + y, ball.xPos + x);
            newB.SetMovingdirection(y, x);
            newB.lastCollidedPlayerId = ball.lastCollidedPlayerId;
          });
        }

        this.removeReward(<Reward>gameObject);
      }
    });

    return gameTransferData;
  }

  /**
   * @descriptionin case you want to get the current gameTransferData without
   *                callback function, use this function
   *
   * @returns gameTransferData to send to client
   */
  getCurrentGameTransferData(): Object {
    let gameTransferData = {
      player1: this.player1,
      player2: this.player2,
      player3: this.player3,
      player4: this.player4,
      balls: this.ballArray,
      bricks: this.bricks,
      rewards: this.rewards,
    };

    return gameTransferData;
  }

  /**
   * @descriptionin use this function to get all game objects data
   *
   * @returns all gameTransferData to send to client
   */
  debugGetCurrentGameTransferData(): Object {
    const gameTransferData = {
      allGameObjects: this.gameObjects,
    };
    return gameTransferData;
  }

  getCurrentBouncerInfo(roomId: string): Array<Object> {
    const gameTransferData: Array<Object> = [];

    this.playersMap.forEach((player, key) => {
      gameTransferData.push({
        number: player.playerNumber,
        xPos: player.xPos,
        yPos: player.yPos,
      });
    });

    return gameTransferData;
  }

  getCurrentBallInfo() {
    const gameTransferData: Array<Object> = [];

    this.ballArray.forEach((ball) => {
      gameTransferData.push({
        id: ball.gameID,
        xPos: ball.xPos,
        yPos: ball.yPos,
      });
    });

    return gameTransferData;
  }

  getCurrentBrickInfo() {
    const gameTransferData: Array<Object> = [];

    this.bricks.forEach((brick) => {
      gameTransferData.push({
        id: brick.gameID,
        xPos: brick.xPos,
        yPos: brick.yPos,
        level: brick.life,
      });
    });

    return gameTransferData;
  }

  /**
   * @description use this function to set player direction, player will move each frame
   *
   * @param playerNumber  the player number indicating which player to move
   * @param direction     the player moving direction, can only be "left" or "right"
   * @param moving        false if want to set player to stop moving, true if want to set player to start moving to this direction
   *
   * @throws Error if the direction is invalid
   */
  setPlayerDir(playerNumber: number, direction: string, moving: boolean) {
    //check if string is valid
    if (direction != "left" && direction != "right") {
      throw new Error("Invalid direction");
    }

    const player = this.playersMap.get(playerNumber);

    if (player) {
      if (direction == "left") {
        if (moving) {
          player.playerStartMovingLeft();
        } else {
          player.playerStopMovingLeft();
        }
      }
      if (direction == "right") {
        if (moving) {
          player.playerStartMovingRight();
        } else {
          player.playerStopMovingRight();
        }
      }
    } else {
      throw new Error("Invalid player number");
    }
  }

  //new game object
  newBall(): Ball {
    const circle = new Ball(GameData.BALL_SIZE);
    this.gameObjects.push(circle);
    this.gameColliders.push(circle);
    this.ballArray.push(circle);
    return circle;
  }

  newBrick(): Brick {
    const brick = new Brick();
    this.gameObjects.push(brick);
    this.gameColliders.push(brick);
    this.bricks.push(brick);
    return brick;
  }

  newPlayer(playerNumber: number): PlayerBoard {
    const player = new PlayerBoard(playerNumber);
    this.gameObjects.push(player);
    this.gameColliders.push(player);
    this.playersMap.set(playerNumber, player);
    return player;
  }

  newReward(rewardPlayerId: number): Reward {
    const reward = new Reward(rewardPlayerId);
    this.gameObjects.push(reward);
    this.gameColliders.push(reward);
    this.rewards.push(reward);
    return reward;
  }

  //remove game object
  removeBrick(brick: Brick) {
    //drop reward
    let reward = this.newReward(brick.lastCollidedPlayerId);
    reward.setPosition(
      brick.yPos + (GameData.BRICK_HEIGHT - GameData.REWARD_HEIGHT),
      brick.xPos + (GameData.BRICK_WIDTH - GameData.REWARD_WIDTH)
    );
    if (brick.lastCollidedPlayerId == this.player1.gameID) {
      reward.SetMovingdirection(1, 0);
    } else if (brick.lastCollidedPlayerId == this.player2.gameID) {
      reward.SetMovingdirection(0, -1);
    } else if (brick.lastCollidedPlayerId == this.player3.gameID) {
      reward.SetMovingdirection(-1, 0);
    } else if (brick.lastCollidedPlayerId == this.player4.gameID) {
      reward.SetMovingdirection(0, 1);
    }

    this.gameObjects.splice(this.gameObjects.indexOf(brick), 1);
    this.bricks.splice(this.bricks.indexOf(brick), 1);
    this.gameColliders.splice(this.gameColliders.indexOf(brick), 1);
  }

  removeReward(reward: Reward) {
    this.gameObjects.splice(this.gameObjects.indexOf(reward), 1);
    this.gameColliders.splice(this.gameColliders.indexOf(reward), 1);
    this.rewards.splice(this.rewards.indexOf(reward), 1);
  }

  getPlayerByGameId(playerGameId: number): PlayerBoard {
    if (this.player1.gameID == playerGameId) {
      return this.player1;
    } else if (this.player2.gameID == playerGameId) {
      return this.player2;
    } else if (this.player3.gameID == playerGameId) {
      return this.player3;
    } else if (this.player4.gameID == playerGameId) {
      return this.player4;
    } else {
      throw new Error("Invalid player game id");
    }
  }
}

export { GameInstance };
