import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity, TEventType } from './events.entity';
import { applyEvents } from './events.reducer';
import { SnapshotEntity } from './snapshop.entity';

const SNAPSHOT_INTERVAL = 10;

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepo: Repository<EventEntity>,
    @InjectRepository(SnapshotEntity)
    private readonly snapshotRepo: Repository<SnapshotEntity>,
  ) {}

  async save(type: TEventType, payload: any): Promise<EventEntity> {
    const evt = this.eventsRepo.create({ type, payload });
    const saved = await this.eventsRepo.save(evt);

    const count = await this.eventsRepo.count();

    if (count % SNAPSHOT_INTERVAL === 0) {
      const state = await this.getState(saved.id);
      const snap = this.snapshotRepo.create({
        lastEventId: saved.id,
        state,
      });
      await this.snapshotRepo.save(snap);
    }

    return saved;
  }

  async listAll(): Promise<EventEntity[]> {
    return this.eventsRepo.find();
  }

  async getState(upToId?: string) {
    const all = await this.listAll();

    let needed = all;

    if (upToId) {
      const id = all.findIndex((e) => e.id === upToId);
      if (id === -1) {
        throw new NotFoundException(`Не найдена версия с id ${upToId}`);
      }
      needed = all.slice(0, id + 1);
    }

    return applyEvents(needed);
  }
}
