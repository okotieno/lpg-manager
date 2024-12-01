import { ReadStream } from 'fs-capacitor';

export interface BufferedFile {
  fieldName: string;
  originalName: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

export interface HasFile {
  file: Buffer | string;
}
export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export type AppMimeType = 'image/png' | 'image/jpeg';

export interface UploadedFileMetadata {
  file: Promise<{
    createReadStream(): ReadStream;
    filename: string;
    mimetype: string;
    encoding: string;
  }>;
}
