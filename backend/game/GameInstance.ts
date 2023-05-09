import Ball from "./Ball.ts";
import PlayerBoard from "./PlayerBoard.ts";
import * as GameData from "./GameData.ts";
import Brick from "./Brick.ts";
import Reward, { RewardType } from "./Reward.ts";
import Wall from "./Wall.ts";
import BrickMap, { generateBrickMap } from "./BrickMap.ts";

export default class GameInstance {
  gameRoomId: string;
  gameObjects: Array<GameData.IGameObject>;
  gameColliders: Array<GameData.ICollidable>;

  playersMap: Map<number, PlayerBoard>;

  balls: Array<Ball>;
  bricks: Array<Brick>;
  walls: Array<Wall>;
  rewards: Array<Reward>;

  updateInterval: number;

  /**
   * @description initialize game
   *              start game loop
   *              send gameTransferData to client every frame
   *
   * @param gameRoomId        id of the game room
   * @param playerAmount      amount of players in the game
   * @param CALLBACK_FUNCTION callback function to send gameTransferData to client, see {@link Callback}
   */
  constructor(gameRoomId: string, playerAmount: number) {
    this.gameObjects = new Array<GameData.IGameObject>();
    this.gameRoomId = gameRoomId;
    this.gameColliders = new Array<GameData.ICollidable>();
    this.playersMap = new Map<number, PlayerBoard>();
    this.balls = new Array<Ball>();
    this.bricks = new Array<Brick>();
    this.rewards = new Array<Reward>();
    this.walls = new Array<Wall>();

    //initialize player

    const player1 = this.newPlayer(1);

    const player1PosX =
      GameData.GAME_CANVAS_WIDTH / 2 - player1.displayWidth / 2;
    const player1PosY =
      GameData.GAME_CANVAS_WIDTH - (player1.displayHeight + player1.wallMargin);
    player1.setPosition(player1PosX, player1PosY);

    if (playerAmount >= 2) {
      const player2 = this.newPlayer(2);

      const player2PosX = 0 + player2.wallMargin;
      const player2PosY =
        GameData.GAME_CANVAS_HEIGHT / 2 - player2.displayHeight / 2;
      player2.setPosition(player2PosX, player2PosY);
    } else {
      this.newWall(2);
    }

    if (playerAmount >= 3) {
      const player3 = this.newPlayer(3);

      const player3PosX =
        GameData.GAME_CANVAS_WIDTH / 2 - player3.displayWidth / 2;
      const player3PosY = 0 + player3.wallMargin;
      player3.setPosition(player3PosX, player3PosY);
    } else {
      this.newWall(3);
    }

    if (playerAmount >= 4) {
      const player4 = this.newPlayer(4);

      const player4PosX =
        GameData.GAME_CANVAS_WIDTH -
        (player4.displayWidth + player4.wallMargin);
      const player4PosY =
        GameData.GAME_CANVAS_HEIGHT / 2 - player4.displayHeight / 2;
      player4.setPosition(player4PosX, player4PosY);
    } else {
      this.newWall(4);
    }

    if (playerAmount > 4) {
      throw new Error("playerAmount cannot be greater than 4");
    }

    //initialize ball
    const ball = this.newBall();
    ball.setPosition(
      GameData.GAME_CANVAS_WIDTH / 2,
      GameData.GAME_CANVAS_HEIGHT / 2
    );
    ball.lastCollidedPlayerId = player1.gameID;

    //initialize bricks
    const brickMap: BrickMap = generateBrickMap();

    brickMap.map.forEach((brickRow, i) => {
      brickRow.forEach((brick, j) => {
        if (brick.life != 0) {
          const newBrick = this.newBrick();
          newBrick.setPosition(
            GameData.GAME_CANVAS_WIDTH -
              GameData.BRICK_MAP_WIDTH +
              j * (newBrick.displayWidth + GameData.BRICK_MARGIN) +
              GameData.BRICK_MARGIN,
            GameData.GAME_CANVAS_HEIGHT -
              GameData.BRICK_MAP_HEIGHT +
              i * (newBrick.displayHeight + GameData.BRICK_MARGIN) +
              GameData.BRICK_MARGIN
          );
          newBrick.life = brick.life;
        }
      });
    });

    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < 10; j++) {
    //     const brick = this.newBrick();
    //     //set brick position and margin
    //     brick.setPosition(
    //       GameData.GAME_CANVAS_WIDTH -
    //         GameData.BRICK_MAP_WIDTH +
    //         i * (brick.displayWidth + GameData.BRICK_MARGIN) +
    //         GameData.BRICK_MARGIN,
    //       GameData.GAME_CANVAS_HEIGHT -
    //         GameData.BRICK_MAP_HEIGHT +
    //         j * (brick.displayHeight + GameData.BRICK_MARGIN) +
    //         GameData.BRICK_MARGIN
    //     );
    //   }
    // }

    //test initalization
    ball.SetMovingdirection(1, 1);

    //start game loop
    this.updateInterval = setInterval(() => {
      this.Update();
    }, 1000 / GameData.FPS);
  }

  /**
   * what this game do every frame
   * @returns gameTransferData to send to client
   */
  Update(): Record<string, unknown> {
    const updatedGameObject = Array<GameData.ICollidable>();

    //update player position
    for (const player of this.playersMap.values()) {
      player.move();
    }

    //update ball position
    this.balls.forEach((ball) => {
      ball.move();
      //if ball is out of bound, remove it
      if (
        ball.xPos < 0 - GameData.BALL_SIZE ||
        ball.xPos > GameData.GAME_CANVAS_WIDTH + GameData.BALL_SIZE ||
        ball.yPos < 0 - GameData.BALL_SIZE ||
        ball.yPos > GameData.GAME_CANVAS_HEIGHT + GameData.BALL_SIZE
      ) {
        this.removeBall(ball);
      }
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
        const brick = <Brick>gameObject;
        if (brick.life <= 0) {
          const hitPlayer = this.getPlayerByGameId(brick.lastCollidedPlayerId);
          hitPlayer.increaseScore(1);
          this.removeBrick(brick);
        }
      } else if (gameObject instanceof Reward) {
        const reward = <Reward>gameObject;

        if (reward.rewardType == RewardType.BiggerPaddle) {
          this.getPlayerByGameId(reward.rewardPlayerId).biggerPadddle();
        } else if (reward.rewardType == RewardType.biggerBall) {
          this.balls.forEach((ball) => {
            ball.biggerBall();
          });
        } else if (reward.rewardType == RewardType.extraBall) {
          const ballArrayCopy = [...this.balls];
          ballArrayCopy.forEach((ball) => {
            const newB = this.newBall();
            //generate ramdom number with range [-1,1] for both x and y
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            newB.setPosition(ball.yPos + y, ball.xPos + x);
            newB.SetMovingdirection(y, x);
            newB.lastCollidedPlayerId = ball.lastCollidedPlayerId;
          });
        }

        this.removeReward(<Reward>gameObject);
      }
    });

    let gameTransferData = this.getCurrentGameTransferData(); //instantiate Object to send to client

    //game over or game won
    if (this.balls.length == 0) {
      gameTransferData = { gameOver: true };
      console.log("game over");
      clearInterval(this.updateInterval);
    } else if (this.bricks.length == 0) {
      gameTransferData = { gameWon: true };
      console.log("game won");
      clearInterval(this.updateInterval);
    }

    return gameTransferData;
  }

  getCurrentBouncerInfo(): Record<string, number>[] {
    const gameData: Array<Record<string, number>> = [];
    this.playersMap.forEach((player) => {
      gameData.push({
        number: player.playerNumber,
        xPos: player.xPos,
        yPos: player.yPos,
        width: player.displayWidth,
        height: player.displayHeight,
        score: player.score,
      });
    });

    return gameData;
  }

  getCurrentBallInfo(): Record<string, number>[] {
    const gameData: Array<Record<string, number>> = [];
    this.balls.forEach((ball) => {
      gameData.push({
        id: ball.gameID,
        xPos: ball.xPos,
        yPos: ball.yPos,
        size: ball.size,
      });
    });

    return gameData;
  }

  getCurrentBrickInfo(): Record<string, number>[] {
    const gameData: Array<Record<string, number>> = [];
    this.bricks.forEach((brick) => {
      gameData.push({
        id: brick.gameID,
        xPos: brick.xPos,
        yPos: brick.yPos,
        width: brick.displayWidth,
        height: brick.displayHeight,
        level: brick.life,
      });
    });

    return gameData;
  }

  getCurrentRewardInfo(): Record<string, number | RewardType>[] {
    const gameData: Array<Record<string, number | RewardType>> = [];
    this.rewards.forEach((reward) => {
      gameData.push({
        id: reward.gameID,
        xPos: reward.xPos,
        yPos: reward.yPos,
        width: reward.displayWidth,
        height: reward.displayHeight,
        type: reward.rewardType,
      });
    });

    return gameData;
  }

  getCurrentWallInfo(): Record<string, number>[] {
    const gameData: Array<Record<string, number>> = [];
    this.walls.forEach((wall) => {
      gameData.push({
        id: wall.gameID,
        xPos: wall.xPos,
        yPos: wall.yPos,
        width: wall.displayWidth,
        height: wall.displayHeight,
      });
    });

    return gameData;
  }

  /**
   * @descriptionin case you want to get the current gameTransferData without
   *                callback function, use this function
   *
   * @returns gameTransferData to send to client
   */
  getCurrentGameTransferData(): Record<string, unknown> {
    const gameTransferData = {
      playersMap: this.getCurrentBouncerInfo(),
      balls: this.getCurrentBallInfo(),
      bricks: this.getCurrentBrickInfo(),
      rewards: this.getCurrentRewardInfo(),
      walls: this.getCurrentWallInfo(),
    };

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

    const player = this.getPlayerByPlayerNumber(playerNumber);

    if (!player) {
      return;
    }

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
    this.balls.push(circle);
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

  newWall(playerNumber: number): Wall {
    const wall = new Wall(playerNumber);
    this.gameObjects.push(wall);
    this.gameColliders.push(wall);
    this.walls.push(wall);
    return wall;
  }

  //remove game object
  removeBrick(brick: Brick) {
    //drop reward
    const reward = this.newReward(brick.lastCollidedPlayerId);

    if (reward.rewardType == RewardType.None) {
      this.removeReward(reward);
    } else {
      reward.setPosition(
        brick.yPos + (GameData.BRICK_HEIGHT - GameData.REWARD_HEIGHT),
        brick.xPos + (GameData.BRICK_WIDTH - GameData.REWARD_WIDTH)
      );
      if (
        this.getPlayerByGameId(brick.lastCollidedPlayerId).playerNumber == 1
      ) {
        reward.SetMovingdirection(1, 0);
      } else if (
        this.getPlayerByGameId(brick.lastCollidedPlayerId).playerNumber == 2
      ) {
        reward.SetMovingdirection(0, -1);
      } else if (
        this.getPlayerByGameId(brick.lastCollidedPlayerId).playerNumber == 3
      ) {
        reward.SetMovingdirection(-1, 0);
      } else if (
        this.getPlayerByGameId(brick.lastCollidedPlayerId).playerNumber == 4
      ) {
        reward.SetMovingdirection(0, 1);
      }
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

  removeBall(ball: Ball) {
    this.gameObjects.splice(this.gameObjects.indexOf(ball), 1);
    this.gameColliders.splice(this.gameColliders.indexOf(ball), 1);
    this.balls.splice(this.balls.indexOf(ball), 1);
  }

  getPlayerByGameId(playerGameId: number): PlayerBoard {
    let outPlayer: PlayerBoard | undefined = undefined;

    this.playersMap.forEach((player: PlayerBoard) => {
      if (player.gameID == playerGameId) {
        outPlayer = player;
      }
    });

    if (outPlayer != undefined) {
      return outPlayer;
    } else {
      this.playersMap.forEach((player: PlayerBoard) => {
        console.log(player.gameID);
      });
      console.log("Invalid player game id: " + playerGameId);
      throw new Error("Invalid player game id");
    }
  }

  getPlayerByPlayerNumber(playerNumber: number): PlayerBoard {
    const player = this.playersMap.get(playerNumber);
    if (player) {
      return player;
    } else {
      throw new Error("Invalid player number");
    }
  }
}

export { GameInstance };
