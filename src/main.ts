import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Swagger configuration
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply ValidationPipe globally. Now, we don't need to add ValidationPipe in each controller method.
  // This ensures that all incoming requests are validated according to the DTOs defined for each route handler.
  app.useGlobalPipes(
    new ValidationPipe({
      // Setting whitelist to true will strip any properties that are not defined in the DTO and would not allow them to pass through validation and the controller method.
      // But still the request will go through the controller method with the properties that are defined in the DTO.
      whitelist: true,

      // we can use forbidNonWhitelisted to throw an error if non-whitelisted properties are present in the request.
      forbidNonWhitelisted: true,

      // transform option will automatically transform the payloads to be objects typed according to their DTO classes.
      // Usually an incoming request's payload is not the type of the DTO. But with transform: true, it will be transformed to the expected DTO type.
      // What this does is, it will convert the primitive types to the types defined in the DTOs. For example, if a property is defined as number in the DTO, but comes as string in the request payload, it will be converted to number.
      // This will convert an incoming request to an instance of the DTO class after validation.
      transform: true,
    }),
  );

  /**
   * Swagger configuration
   */
  // This builds the configuration object
  const config = new DocumentBuilder()
    .setTitle('NestJS Masterclass - Blog App API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense(
      'MIT License',
      'http://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  // Integrate swagger
  // Instantiate a document object
  const document = SwaggerModule.createDocument(app, config);
  // Use the document to complete the setup
  // This setup method takes minimum of three arguments
  // 1. Path to the documentation: {base path to the app}/{whatever the path to the documentation} - localhost:3000/api
  // 2. Application itself
  // 3. Document object
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
