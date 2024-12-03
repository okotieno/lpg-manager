import { ApolloLink } from '@apollo/client/core';

export const
  multipartFormContext = () => new ApolloLink((operation, forward) => {
    const useMultipart = operation.getContext()['useMultipart'];
    if (useMultipart) {
      operation.setContext({
        headers: {
          'Apollo-Require-Preflight': 'true'
        }
      });
    }
    return forward(operation);
  });
