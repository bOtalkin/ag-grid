import rootESLint from '../../eslint.config.mjs';

export default [
    ...rootESLint,
    {
        rules: {
            'no-restricted-imports': 'warn',
            'no-fallthrough': 'warn',
            'no-case-declarations': 'warn',
            'no-prototype-builtins': 'warn',
            'no-unexpected-multiline': 'warn',
            'no-useless-escape': 'warn',
            'prefer-spread': 'warn',
            'no-irregular-whitespace': 'warn',
            '@typescript-eslint/ban-types': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'prefer-const': 'warn',
            'prefer-rest-params': 'warn',
            '@typescript-eslint/no-var-requires': 'warn',
            '@typescript-eslint/prefer-as-const': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
            '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
            '@typescript-eslint/no-this-alias': 'warn',
        },
    },
];
