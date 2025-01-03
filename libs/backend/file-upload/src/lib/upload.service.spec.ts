import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { getModelToken } from '@nestjs/sequelize';
import { FileUploadModel } from '@lpg-manager/db';
import { BufferedFile } from './file.model';
import { Readable } from 'stream';
import * as crypto from 'crypto';
import { FileUploadService } from './upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;
  // let minioService: MinioService;

  const mockMinioClient = {
    putObject: jest.fn(),
    removeObjects: jest.fn(),
    getObject: jest.fn(),
  };

  const mockMinioService = {
    client: mockMinioClient,
  };

  const mockFileUploadModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        { provide: MinioService, useValue: mockMinioService },
        {
          provide: getModelToken(FileUploadModel),
          useValue: mockFileUploadModel,
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
    // minioService = module.get<MinioService>(MinioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should throw an error if file is not jpeg or png', async () => {
      const file: BufferedFile = {
        encoding: '',
        fieldName: '',
        size: 0,
        buffer: Buffer.from(''),
        mimetype: 'application/pdf' as unknown as BufferedFile['mimetype'], // Invalid type
        originalName: 'test.pdf',
      };

      await expect(service.upload(file)).rejects.toThrow(
        new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
      );
    });

    it('should upload a file and return the filename', async () => {
      const file: BufferedFile = {
        encoding: '',
        fieldName: '',
        size: 0,
        buffer: Buffer.from('test file'),
        mimetype: 'image/jpeg', // Valid type
        originalName: 'test.jpg',
      };

      const hashedFileName = crypto
        .createHash('md5')
        .update(Date.now().toString())
        .digest('hex');
      const expectedFileName = `${hashedFileName}.jpg`;

      mockMinioClient.putObject.mockImplementation((_, __, ___, callback) => {
        callback(null);
      });

      const result = await service.upload(file);

      expect(mockMinioClient.putObject).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(Object),
        expect.any(Function)
      );
      expect(result).toEqual(expectedFileName);
    });

    it('should throw an error if putObject fails', async () => {
      const file: BufferedFile = {
        encoding: '',
        fieldName: '',
        size: 0,
        buffer: Buffer.from('test file'),
        mimetype: 'image/jpeg',
        originalName: 'test.jpg',
      };

      mockMinioClient.putObject.mockImplementation((_, __, ___, callback) => {
        callback(new Error('Upload failed'));
      });

      await expect(service.upload(file)).rejects.toThrow(
        new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('delete', () => {
    it('should delete an object', async () => {
      mockMinioClient.removeObjects.mockImplementation((_, __, callback) => {
        callback(null);
      });

      await service.delete('test-object');

      expect(mockMinioClient.removeObjects).toHaveBeenCalledWith(
        expect.any(String),
        ['test-object'],
        expect.any(Function)
      );
    });

    it('should throw an error if delete fails', async () => {
      mockMinioClient.removeObjects.mockImplementation((_, __, callback) => {
        callback(new Error('Delete failed'));
      });

      await expect(service.delete('test-object')).rejects.toThrow(
        new HttpException(
          'Oops Something wrong happened',
          HttpStatus.BAD_REQUEST
        )
      );
    });
  });

  describe('getObject', () => {
    it('should return the object as a buffer', async () => {
      const mockDataStream = new Readable();
      mockDataStream._read = jest.fn(); // Mock the read method
      mockMinioClient.getObject.mockImplementation((_, __, callback) => {
        callback(null, mockDataStream);
      });

      const mockBuffer = Buffer.from('test data');
      mockDataStream.push(mockBuffer);
      mockDataStream.push(null); // End the stream

      const result = await service.getObject('test-object');

      expect(mockMinioClient.getObject).toHaveBeenCalledWith(
        expect.any(String),
        'test-object',
        expect.any(Function)
      );
      expect(result).toEqual(mockBuffer);
    });

    it('should throw an error if getObject fails', async () => {
      mockMinioClient.getObject.mockImplementation((_, __, callback) => {
        callback(new Error('GetObject failed'), null);
      });

      await expect(service.getObject('test-object')).rejects.toThrow(
        'GetObject failed'
      );
    });
  });
});
