import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { OperationDefinitionNode } from 'graphql/language';
import { inject } from '@angular/core';
import { contextSuccessAlert } from './success-alert.context';
import { multipartFormContext } from './multipart-form.context';

import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { ENV_VARIABLES } from '@lpg-manager/injection-token';

import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { AuthStore } from '@lpg-manager/auth-store';
import { setContext } from '@apollo/client/link/context';
import { Preferences } from '@capacitor/preferences';
import { contextErrorAlert } from './error-alert.context';

export const apolloConfig = ()=> {
  const httpLink = inject(HttpLink);
  const backendUrl = inject(ENV_VARIABLES).backendUrl;
  const toastCtrl= inject(ToastController);
  const alertCtrl = inject(AlertController);

  const http = httpLink.create({
    uri: `${backendUrl}/graphql`,
    extractFiles: (body) => extractFiles(body, isExtractableFile) as any
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await Preferences.get({ key: 'access-token' });
    return {
      headers: {
        ...headers,
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
    };
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${backendUrl.replace('http', 'ws') ?? ''}/graphql`,
      connectionParams: async () => {
        const token = await Preferences.get({ key: 'access-token' });

        return {
          Authorization: token.value ? `Bearer ${token.value}` : '',
        }
      },
    }),
  );

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    http
  );

  const combinedLink = ApolloLink.from([
    contextSuccessAlert(toastCtrl),
    contextErrorAlert(alertCtrl),
    multipartFormContext(),

    ApolloLink.from([authLink, link]),
  ]);

  return {
    cache: new InMemoryCache(),
    link: combinedLink
  };
}
