module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  extends: ["@charrue/base"],
  rules: {
    "no-console": "off",
    "no-restricted-syntax": "off",
  },
};
