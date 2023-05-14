type Player = {
  id: string;
  number: number;
  name: string;
  isReady: boolean;
};

type GameObject = {
  id: number;
  xPos: number;
  yPos: number;
};

type Ball = GameObject & {
  size: number;
};

type Bouncer = GameObject & {
  height: number;
  width: number;
  number: number;
  skinName: string;
};

type Brick = GameObject & {
  height: number;
  width: number;
  level: number;
};

type Reward = GameObject & {
  height: number;
  width: number;
  type: string;
};

type Wall = GameObject & {
  height: number;
  width: number;
};

type GameStatus = {
  status: string;
  scores: {
    number: number;
    score: number;
  }[];
};
