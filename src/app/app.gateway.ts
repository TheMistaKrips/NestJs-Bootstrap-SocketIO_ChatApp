import { AppService } from './../app.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Prisma } from '@prisma/client';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handlesendMessage(
    client: Socket,
    payload: Prisma.ChatCreateInput,
  ): Promise<void> {
    await this.appService.createMessate(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(client: Socket) {
    console.log(`Connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconected: ${client.id}`);
  }
}
