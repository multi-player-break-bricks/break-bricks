type Player = {
  id: string;
  name: string;
  isReady: boolean;
};

type GameObject = {
  xPos: number;
  yPos: number;
};

type Bouncer = GameObject & {
  number: number;
  id: string;
};

type Brick = GameObject & {
  id: string;
  level: number;
};
