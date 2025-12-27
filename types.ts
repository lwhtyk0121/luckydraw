
export interface Participant {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Participant[];
}

export enum Tab {
  LIST = 'list',
  DRAW = 'draw',
  GROUP = 'group'
}
