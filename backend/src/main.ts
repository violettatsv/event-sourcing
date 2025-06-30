import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://event-sourcing-gozp.vercel.app',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;

  class CustomIoAdapter extends IoAdapter {
    createIOServer(port: number, options?: any) {
      const corsOptions = {
        origin: 'https://event-sourcing-gozp.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true,
      };
      return super.createIOServer(port, { ...options, cors: corsOptions });
    }
  }
  app.useWebSocketAdapter(new CustomIoAdapter(app));

  console.log(`Server listening on ${port}`);
  await app.listen(port);
}
bootstrap();
