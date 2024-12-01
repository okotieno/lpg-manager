/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';

import { AppModule } from './app/app.module';

declare module 'fastify' {
  interface FastifyRequest {
    isMultipart?: boolean;
  }
}

const processRequest = require('graphql-upload/processRequest.js')

function fastifyGraphQLUpload(fastify: FastifyInstance) {
  fastify.addContentTypeParser('multipart', (req, body, done) => {
    req.isMultipart = true
    done(null)
  })

  fastify.addHook('preValidation', async function(request, reply) {
    if (!request.isMultipart) {
      return
    }
    request.body = await processRequest(request.raw, reply.raw)
  })
}


async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  fastifyGraphQLUpload(fastifyAdapter.getInstance());

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const port = process.env['LPG_BACKEND_PORT'] || 6005;
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/graphql`
  );
}

bootstrap().then();
