import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinEvent')
  handleJoinEvent(
    @MessageBody() eventId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`event_${eventId}`);
    return { event: 'joined', data: eventId };
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { eventId: string; content: string; senderId: string; senderName: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`event_${data.eventId}`).emit('message', data);
    // Note: In a real app, we would also persist this to the database here
  }
}
