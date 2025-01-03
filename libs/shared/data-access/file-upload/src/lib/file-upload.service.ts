import { Injectable } from '@angular/core';
import {
  IGetFileUploadsGQL,
  IUploadFileGQL,
  IUploadFileMutation,
} from './schemas/file-upload.generated';
import { SHOW_SUCCESS_MESSAGE } from '@lpg-manager/injection-token';
import { map, Observable } from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { IQueryParams } from '@lpg-manager/types';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private uploadFileGQL: IUploadFileGQL,
    private getFileUploadsGQL: IGetFileUploadsGQL
  ) {}

  getItems(params: IQueryParams) {
    return this.getFileUploadsGQL
      .fetch({ query: params })
      .pipe(map((res) => res.data.fileUploads));
  }

  uploadFile(
    file: any,
    progressHandler?: (val: number) => void
  ): Observable<MutationResult<IUploadFileMutation>> {
    return this.uploadFileGQL.mutate(
      { file },
      {
        context: {
          fetchOptions: {
            onUploadProgress: (progress: number) => {
              progressHandler?.(progress);
            },
          },
          useMultipart: true,
          [SHOW_SUCCESS_MESSAGE]: true,
        },
      }
    );
  }
}
