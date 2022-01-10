import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import * as cookie from 'cookie';
import { AuthService } from '../../auth/services/auth.service';
import { DeviceService } from '../../devices/services/device.service';

@WebSocketGateway({ namespace: '/socket/notification', cors: true })
export class NotificationGateway implements OnGatewayConnection {
  constructor(
    private _authService: AuthService,
    private _deviceService: DeviceService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      console.log('connected');
      const userId = client.handshake?.query?.userId;
      // const user = await this._authService.verifyToken(token);
      this._deviceService.createDevice({
        socket_id: client.id,
        user_id: userId as string,
      });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnect');
    const userId = client.handshake?.query?.userId;
    this._deviceService.removeDevice(client.id);
    client.disconnect();
  }
}
