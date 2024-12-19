import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { config } from './minio.config';
import { FileUploadService } from './upload.service';
import { FileUploadResolver } from './upload.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileUploadModel } from '@lpg-manager/db';
import { ImageController } from './upload.controller';
import process from 'node:process';

@Module({
  imports: [
    SequelizeModule.forFeature([FileUploadModel]),
    MinioModule.register({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: false,
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
    }),
  ],
  providers: [
    FileUploadService,
    FileUploadResolver,
    { provide: 'BACKEND_URL', useValue: process.env['LPG_BACKEND_URL'] },
  ],
  controllers: [ImageController],
  exports: [FileUploadService],
})
export class FileUploadModule {}
