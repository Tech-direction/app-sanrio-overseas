// extensions/checkout-validation/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './schema.graphql',           // ← 実際のスキーマの置き場所に合わせて調整
  documents: './src/**/*.graphql',      // ← クエリ定義のある場所に合わせる
  generates: {
    './src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
    },
  },
  hooks: {},
};
export default config;