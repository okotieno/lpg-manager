import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'libs/backend/graphql/src/lib/schemas',
  generates: {
    'libs/shared/types/src/lib/types.ts': {
      plugins: ['typescript'],
      config: {
        addExplicitOverride: true,
        typesPrefix: 'I',
        skipTypename: true,
        scalars: {
          DateTime: 'string'
        }
      },
    },
  },
  overwrite: true
}

export default config
