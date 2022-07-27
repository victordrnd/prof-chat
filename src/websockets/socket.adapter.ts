import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import { INestApplication, INestMicroservice } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


export class SocketAdapter extends IoAdapter {
 
  protected redisAdapter;

  constructor(app: INestMicroservice) {
    super(app);
    const configService = app.get(ConfigService);

    const pubClient = createClient({
      socket: {
        host: configService.get('urls.redis'),
        port: 6379,
      },
    });
    const subClient = pubClient.duplicate();

    pubClient.connect();  // <------
    subClient.connect();  // <------

    this.redisAdapter = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server;

    server.adapter(this.redisAdapter);

    return server;
  }
}
