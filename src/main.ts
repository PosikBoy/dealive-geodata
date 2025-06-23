import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const PORT = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Документация сервиса геокодирования для Dealive")
    .setDescription("Документация сервиса геокодирования для Dealive")
    .setVersion("1.0")
    .addTag("yungg")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);

  app.enableCors({
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Разрешённые HTTP методы
  });

  //Включает проверку данных
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     stopAtFirstError: true,
  //   })
  // );

  await app.listen(PORT, () => {
    console.log("Server started on " + PORT);
  });
}
bootstrap();
