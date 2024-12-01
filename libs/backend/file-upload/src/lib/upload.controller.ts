import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { FileUploadService } from './upload.service';
import { FileUploadModel } from '@lpg-manager/db';
import { FastifyReply } from 'fastify';

@Controller('images')
export class ImageController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Get(':imageId')
  async getImage(
    @Param('imageId') imageId: number,

    @Res() res: FastifyReply,
  ) {
    try {
      const fileUpload = (await this.fileUploadService.findById(
        imageId,
      )) as FileUploadModel;
      const objectName = fileUpload.name as string;

      const fileBuffer = await this.fileUploadService.getObject(objectName);
      res.header('Content-Disposition', `attachment; filename=${objectName}`);
      res.header('Content-Type', 'image/jpeg'); // Set appropriate content type for the image
      res.send(fileBuffer);
    } catch (error) {
      Logger.log(error);
      res.status(500).send('Error downloading file');
    }
  }
}
