import { Module } from "@nestjs/common";
import { GeodataModule } from "./geodata/geodata.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    GeodataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
