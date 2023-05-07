type Player = {
  id: string;
  name: string;
  isReady: boolean;
};

type GameObject = {
  id: string;
  xPos: number;
  yPos: number;
};

type Bouncer = GameObject & {
  number: number;
};

type Brick = GameObject & {
  level: number;
};
