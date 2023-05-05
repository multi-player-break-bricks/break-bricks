export type Player = {
  id: string;
  name: string;
  isReady: boolean;
};

export type GameObject = {
  xPos: number;
  yPos: number;
};

export type Brick = GameObject & {
  level: number;
};
