import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './events.entity';
import { EventsGateaway } from './events.gateway';
import { EventsService } from './events.service';
import { SnapshotEntity } from './snapshop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, SnapshotEntity])],
  providers: [EventsService, EventsGateaway],
  exports: [EventsService],
})
export class EventsModule {}
