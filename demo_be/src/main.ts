import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();   // 允许前端跨域请求
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();