export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
  '*.{js,cjs,mjs}': ['eslint --fix', 'prettier --write'],
};
