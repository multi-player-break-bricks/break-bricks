import Circle from "./circle";
import Brick from "./brick";
import PlayerBoard from "./PlayerBoard";
import * as GameData from "./GameData";

export default class GameInstance {
  gameRoomId: string;
  gameObjects: Array<GameData.ICollidable>;

  player1: PlayerBoard;
  player2: PlayerBoard;
  player3: PlayerBoard;
  player4: PlayerBoard;

  playersMap: Map<number, PlayerBoard>;

  ball: Circle;

  constructor(gameRoomId: string) {
    //initialize player
    this.playersMap = new Map<number, PlayerBoard>();
    this.playersMap.set(1, (this.player1 = new PlayerBoard(1)));
    this.playersMap.set(2, (this.player2 = new PlayerBoard(2)));
    this.playersMap.set(3, (this.player3 = new PlayerBoard(3)));
    this.playersMap.set(4, (this.player4 = new PlayerBoard(4)));

    let player1PosX =
      GameData.GAME_CANVAS_WIDTH / 2 - this.player1.displayWidth / 2;
    let player1PosY =
      GameData.GAME_CANVAS_WIDTH -
      (this.player1.displayHeight + this.player1.wallMargin);
    this.player1.setPosition(player1PosX, player1PosY);

    let player2PosX = 0 + this.player2.wallMargin;
    let player2PosY =
      GameData.GAME_CANVAS_HEIGHT / 2 - this.player2.displayHeight / 2;
    this.player2.setPosition(player2PosX, player2PosY);

    let player3PosX =
      GameData.GAME_CANVAS_WIDTH / 2 - this.player3.displayWidth / 2;
    let player3PosY = 0 + this.player3.wallMargin;
    this.player3.setPosition(player3PosX, player3PosY);

    let player4PosX =
      GameData.GAME_CANVAS_WIDTH -
      (this.player4.displayWidth + this.player4.wallMargin);
    let player4PosY =
      GameData.GAME_CANVAS_HEIGHT / 2 - this.player4.displayHeight / 2;
    this.player4.setPosition(player4PosX, player4PosY);

    //initialize ball
    this.ball = new Circle(GameData.BALL_SIZE);
    this.ball.setPosition(
      GameData.GAME_CANVAS_WIDTH / 2,
      GameData.GAME_CANVAS_HEIGHT / 2
    );
  }

  /**
   * @param playerNumber the player number indicating which player to move
   * @param direction    the player moving direction, can only be "left" or "right"
   * @throws Error if the direction is invalid
   */
  movePlayer(playerNumber: number, direction: string) {
    //check if string is valid
    if (direction != "left" && direction != "right") {
      throw new Error("Invalid direction");
    }

    let player = this.playersMap.get(playerNumber);
    if (player) {
      player.movePlayer(direction);
    }
  }
}
