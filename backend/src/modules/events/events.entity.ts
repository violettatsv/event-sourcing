import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const VALID_TYPES: TEventType[] = [
  'SquareCreated',
  'SquareMoved',
  'SquareDeleted',
];

export type TEventType = 'SquareCreated' | 'SquareMoved' | 'SquareDeleted';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  type: TEventType;

  @Column({ type: 'jsonb' })
  payload: any;

  @CreateDateColumn()
  timestamp: Date;
}
