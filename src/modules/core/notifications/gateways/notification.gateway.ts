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

@WebSocketGateway(8080, { namespace: '/socket/notification', cors: true })
export class NotificationGateway implements OnGatewayConnection {
  constructor(
    private _authService: AuthService,
    private _deviceService: DeviceService,
  ) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      console.log('connect');
      const cookies = cookie.parse(client.handshake.headers.cookie);
      const user = await this._authService.verifyToken(
        cookies.access_token_cms,
      );
      this._deviceService.createDevice({
        socket_id: client.id,
        user_id: user._id,
      });
    } catch (error) {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log('disconnect');
    const cookies = cookie.parse(client.handshake.headers.cookie);
    const user = await this._authService.verifyToken(cookies.access_token_cms);
    this._deviceService.removeDevice({
      socket_id: client.id,
      user_id: user._id,
    });
    client.disconnect();
  }
}
