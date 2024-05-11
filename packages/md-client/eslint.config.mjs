import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from "eslint-plugin-react"
import globals from "globals"

export default  tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        plugins: {
          react,
        },
        languageOptions: {
          parserOptions: {
            ecmaFeatures: {
              jsx: true,
            },
          },
          globals: {
            ...globals.browser,
          },
        },
        rules:{
            ...react.configs['jsx-runtime'].rules,
        }
    },
    {
        ignores: ["node_modules/"],
    }
)
