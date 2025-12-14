import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GeodataModule } from "./geodata/geodata.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    GeodataModule,
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.{process.env.NODE_ENV}`,
    }),
  ],
  controllers: [],
})
export class AppModule {}
