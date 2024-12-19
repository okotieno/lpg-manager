import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { IUploadFileGQL } from './schemas/file-upload.generated';
import { MutationResult } from 'apollo-angular';

const uploadFileGQLGQLMock = {
  mutate: jest.fn(() =>
    of({
      data: { createFileUpload: { id: 1, name: 'Test FileUpload' } }
    } as MutationResult)
  )
};


describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FileUploadService,
        { useValue: uploadFileGQLGQLMock, provide: IUploadFileGQL }
      ]
    });
    service = TestBed.inject(FileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
