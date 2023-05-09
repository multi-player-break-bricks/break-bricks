import * as GameData from "./GameData.ts";

export default class Reward
  implements GameData.ICollidable, GameData.IGameObject
{
  gameID: number;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  gameObjectType: GameData.GameObjectType;
  name: string;
  displayWidth: number;
  displayHeight: number;
  rewardType: RewardType;
  movingDirectionX: number;
  movingDirectionY: number;
  rewardPlayerId: number;
  colliderType: GameData.ColliderType;
  radius: number;

  constructor(rewardPlayerId: number, rewardType?: RewardType) {
    this.gameID = GameData.generateID();
    this.xPos = 0;
    this.yPos = 0;
    this.movingDirectionX = 0;
    this.movingDirectionY = 0;
    this.width = GameData.REWARD_WIDTH;
    this.height = GameData.REWARD_HEIGHT;
    this.gameObjectType = GameData.GameObjectType.reward;
    this.name = "reward";
    this.displayWidth = this.width;
    this.displayHeight = this.height;
    this.onCollision = this.onCollision.bind(this);
    this.rewardType = rewardType || this.randomRewardType();
    this.rewardPlayerId = rewardPlayerId;
    this.colliderType = GameData.ColliderType.rect;
    this.radius = 0;
  }

  /**
   * will move according to the moving direction
   */
  move(): void {
    //if no moving direction is set, do nothing
    if (
      this.xPos == undefined ||
      this.yPos == undefined ||
      this.movingDirectionX == undefined ||
      this.movingDirectionY == undefined
    ) {
      throw new Error("moving direction or position not set");
      return;
    }

    this.xPos += this.movingDirectionX * GameData.BALL_SPEED;
    this.yPos += this.movingDirectionY * GameData.BALL_SPEED;
  }

  setPosition(yPos: number, xPos: number) {
    this.xPos = xPos;
    this.yPos = yPos;
  }

  SetMovingdirection(yDirection: number, xDirection: number) {
    this.movingDirectionX = xDirection;
    this.movingDirectionY = yDirection;
  }

  onCollision(collidable: GameData.ICollidable): boolean {
    if (collidable.gameObjectType === GameData.GameObjectType.player) {
      return true;
    }
    return false;
  }

  private randomRewardType(): RewardType {
    // chance of no reward
    if (Math.random() > GameData.REWARD_PROBABILITY) {
      return RewardType.None;
    }

    const rewardTypes = Object.values(RewardType); // Get an array of all enum constants
    const randomIndex = Math.floor(
      (Math.random() * rewardTypes.length) / 2 + rewardTypes.length / 2
    ); // Generate a random index
    return rewardTypes[randomIndex] as RewardType; // Return the enum constant at the random index
  }
}

enum RewardType {
  None = -1,
  extraBall = 0,
  biggerBall = 1,
  BiggerPaddle = 2,
}

export { Reward, RewardType };
