export type TEventType = 'SquareCreated' | 'SquareMoved' | 'SquareDeleted';
export enum EventEnum {
  created = 'SquareCreated',
  moved = 'SquareMoved',
  deleted = 'SquareDeleted',
}

export type TSquare = {
  id: string;
  x: number;
  y: number;
  size: number;
};

export type TVersion = {
    id: string;
    timestamp: string;
}

export enum SocketEventTypes {
  getStateAt = 'getStateAt',
  stateUpdate = 'stateUpdate',
  versionList = 'versionList',
  stateAt = 'stateAt',
  connect = 'connect',
  newEvent = 'newEvent',
  backendError = 'backendError'
}