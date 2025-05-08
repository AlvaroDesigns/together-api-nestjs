import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { version } from "./../package.json";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "../../", "static"));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle("API Together")
    .setDescription(
      "BFF for to provide to NN Together App the information from APIM services."
    )
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(29);
}
bootstrap();
