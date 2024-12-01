import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { FileUploadService } from './upload.service';
import { Body, Inject } from '@nestjs/common';
import { AppMimeType, BufferedFile, UploadedFileMetadata } from './file.model';
import { FileUploadModel, IQueryParam } from '@lpg-manager/db';

@Resolver(() => FileUploadModel)
export class FileUploadResolver {
  constructor(
    private readonly fileUploadService: FileUploadService,
    @Inject('BACKEND_URL') private backendUrl: string,
  ) {}

  @Query(() => FileUploadModel)
  fileUploads(@Args('query') query: IQueryParam) {
    return this.fileUploadService.findAll({
      ...query,
      filters: query?.filters ?? [],
    });
  }

  @ResolveField()
  async url(@Parent() fileUploadModel: FileUploadModel) {
    return `${this.backendUrl}/images/${fileUploadModel.id}`;
  }

  @Mutation(() => Boolean)
  async uploadSingleFile(@Body('file') fileObject: UploadedFileMetadata) {
    const file = await fileObject.file;
    const {
      createReadStream,
      filename: originalName,
      mimetype,
      encoding,
    } = file;
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      createReadStream()
        .on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        .on('error', (err) => reject(err))
        .on('end', () => resolve(Buffer.concat(chunks)));
    });
    const bufferedFile: BufferedFile = {
      encoding: '',
      fieldName: '',
      buffer,
      size: buffer.length,
      mimetype: mimetype as AppMimeType,
      originalName,
    };
    const name = await this.fileUploadService.upload(bufferedFile);

    const fileUpload = await this.fileUploadService.create({
      name,
      encoding,
      size: buffer.length,
      mimetype,
      originalName,
    });

    return {
      message: 'Upload success',
      data: fileUpload,
    };
  }
}
