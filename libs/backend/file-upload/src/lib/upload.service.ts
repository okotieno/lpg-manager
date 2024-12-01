import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioClient, MinioService } from 'nestjs-minio-client';
import { config } from './minio.config';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/sequelize';
import { FileUploadModel } from '@lpg-manager/db';
import { CrudAbstractService } from '@lpg-manager/crud-abstract';
import { Readable } from 'stream';

@Injectable()
export class FileUploadService extends CrudAbstractService<FileUploadModel> {
  private readonly baseBucket = config.MINIO_BUCKET as string;

  public get client(): MinioClient {
    return this.minio.client;
  }

  constructor(
    private readonly minio: MinioService,
    @InjectModel(FileUploadModel) fileUploadService: typeof FileUploadModel,
  ) {
    super(fileUploadService);
  }

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const ext = file.originalName.substring(
      file.originalName.lastIndexOf('.'),
      file.originalName.length,
    );
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    this.client.putObject(baseBucket, fileName, fileBuffer, function (err) {
      if (err)
        throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    });

    return fileName;
  }

  async delete(objetName: string, baseBucket: string = this.baseBucket) {
    this.client.removeObjects(baseBucket, [objetName], function (err) {
      if (err)
        throw new HttpException(
          'Oops Something wrong happened',
          HttpStatus.BAD_REQUEST,
        );
    });
  }

  async downloadImageStream(objectName: string): Promise<Readable> {
    return new Promise((resolve, reject) => {
      this.client.getObject(
        this.baseBucket,
        objectName,
        (error, dataStream) => {
          if (error) {
            return reject(error);
          }
          resolve(dataStream);
        },
      );
    });
  }

  async getObject(objectName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.client.getObject(this.baseBucket, objectName, (err, dataStream) => {
        if (err) {
          return reject(err);
        }

        const chunks: Uint8Array[] = [];
        dataStream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        dataStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });

        dataStream.on('error', (error) => {
          reject(error);
        });
      });
    });
  }
}
