// src/events/snapshot.entity.ts
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('snapshots')
export class SnapshotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastEventId: string;

  @Column('jsonb')
  state: any;

  @CreateDateColumn()
  timestamp: Date;
}
