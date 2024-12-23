import { Module } from "@nestjs/common";
import { GeodataService } from "./geodata.service";
import { GeodataController } from "./geodata.controller";
import { PrismaService } from "src/prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  providers: [GeodataService, PrismaService],
  controllers: [GeodataController],
  imports: [HttpModule],
})
export class GeodataModule {}
