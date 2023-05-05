export type Player = {
  id: string;
  name: string;
  isReady: boolean;
};

export type GameObject = {
  xPos: number;
  yPos: number;
};

export type Bouncer = GameObject & {
  id: string;
};

export type Brick = GameObject & {
  id: string;
  level: number;
};
