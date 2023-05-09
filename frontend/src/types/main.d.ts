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

type Bouncer = GameObject & {
  number: number;
};

type Brick = GameObject & {
  level: number;
};

type Reward = GameObject & {
  type: string;
};
