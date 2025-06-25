import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TEventType, VALID_TYPES } from './events.entity';
import { EventsService } from './events.service';

export enum SocketEventTypes {
  getStateAt = 'getStateAt',
  stateUpdate = 'stateUpdate',
  versionList = 'versionList',
  stateAt = 'stateAt',
  connect = 'connect',
  newEvent = 'newEvent',
  backendError = 'backendError',
}

@WebSocketGateway({ cors: true })
export class EventsGateaway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsService: EventsService) {}

  @SubscribeMessage(SocketEventTypes.newEvent)
  async onNewEvent(@MessageBody() data: { type: TEventType; payload: any }) {
    if (!VALID_TYPES.includes(data.type)) {
      this.server.emit(SocketEventTypes.backendError, {
        message: `Неверный тип события: ${data.type}`,
      });
    }
    await this.eventsService.save(data.type, data.payload);
    const versions = await this.eventsService.listAll();
    this.server.emit(SocketEventTypes.versionList, versions);

    const state = await this.eventsService.getState();
    this.server.emit(SocketEventTypes.stateUpdate, state);
  }

  @SubscribeMessage(SocketEventTypes.getStateAt)
  async onGetState(@MessageBody() eventId: string) {
    try {
      const versions = await this.eventsService.listAll();
      this.server.emit(SocketEventTypes.versionList, versions);

      const state = await this.eventsService.getState(eventId);
      this.server.emit(SocketEventTypes.stateAt, { atId: eventId, state });
    } catch (err: any) {
      this.server.emit(SocketEventTypes.backendError, {
        message: `Ошибка при выполнении ${SocketEventTypes.getStateAt}: ${err.message}`,
      });
    }
  }
}
