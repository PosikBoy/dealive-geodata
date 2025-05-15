import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { RedisModule } from "src/redis/redis.module";
import { GeodataController } from "./geodata.controller";
import { GeodataService } from "./geodata.service";

@Module({
  providers: [GeodataService, PrismaService],
  controllers: [GeodataController],
  imports: [HttpModule, RedisModule],
})
export class GeodataModule {}
