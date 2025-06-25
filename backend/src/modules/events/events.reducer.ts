import { BadRequestException } from '@nestjs/common';
import { TEventType } from './events.entity';

type TSquare = {
  id: string;
  x: number;
  y: number;
  size: number;
};

type TEvent = {
  id: string;
  type: TEventType;
  payload: TSquare;
  timestamp: Date;
};

export type TState = Record<string, TSquare>;

export function applyEvents(events: TEvent[]): TState {
  const state = {};

  for (const event of events) {
    const { type, payload } = event;

    switch (type) {
      case 'SquareCreated':
        state[payload.id] = { ...payload };
        break;

      case 'SquareMoved':
        if (state[payload.id]) {
          state[payload.id].x = payload.x;
          state[payload.id].y = payload.y;
        }
        break;

      case 'SquareDeleted':
        delete state[payload.id];
        break;

      default:
        throw new BadRequestException(`Неверный тип: ${event.type}`);
    }
  }

  return state;
}
