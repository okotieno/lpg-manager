import * as Types from '@lpg-manager/types';

import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type IGetFileUploadsQueryVariables = Types.Exact<{
  query?: Types.InputMaybe<Types.IQueryParams>;
}>;


export type IGetFileUploadsQuery = { fileUploads: { items?: Array<{ id: any, name: string, size?: number | null, originalName?: string | null, mimetype?: string | null, url?: any | null } | null> | null, meta?: { totalItems: number } | null } };

export type IUploadFileMutationVariables = Types.Exact<{
  file: Types.Scalars['Upload']['input'];
}>;


export type IUploadFileMutation = { uploadSingleFile: { message?: string | null, data?: { originalName?: string | null, id: any, name: string, size?: number | null, mimetype?: string | null, url?: any | null } | null } };

export const GetFileUploadsDocument = gql`
    query GetFileUploads($query: QueryParams) {
  fileUploads(query: $query) {
    items {
      id
      name
      size
      originalName
      mimetype
      url
    }
    meta {
      totalItems
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IGetFileUploadsGQL extends Apollo.Query<IGetFileUploadsQuery, IGetFileUploadsQueryVariables> {
    override document = GetFileUploadsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UploadFileDocument = gql`
    mutation UploadFile($file: Upload!) {
  uploadSingleFile(file: $file) {
    message
    data {
      originalName
      id
      name
      size
      mimetype
      url
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class IUploadFileGQL extends Apollo.Mutation<IUploadFileMutation, IUploadFileMutationVariables> {
    override document = UploadFileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }