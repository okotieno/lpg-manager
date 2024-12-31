import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'libs/backend/graphql/src/lib/schemas',
  generates: {
    [`libs/shared/data-access/transporter/src/lib/graphql/generated.ts`]: {
      documents: `libs/shared/data-access/transporter/src/lib/**/*.gql`,
      plugins: ['typescript-operations', 'typescript-apollo-angular'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~@lpg-manager/types'
      },
      config: {
        addExplicitOverride: true,
        typesPrefix: 'I',
        skipTypename: true,
        scalars: {
          DateTime: 'string',
          URL: 'string',
          UUID: 'string',
          PositiveInt: 'number',
          PositiveFloat: 'number',
          EmailAddress: 'string',
          PhoneNumber: 'string',
        }
      }
    }
  },
  overwrite: true
};
export default config;
