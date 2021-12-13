module.exports = {
  root: true,
  env: {
    jest: true,
    node: true,
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  extends: ["eslint-config-charrue-base"],
  plugins: ["prettier", "jest"],
  rules: {
    "no-console": "off",
    "no-debugger": "error",
    eqeqeq: "off",
    "max-statements": "off",
    "max-lines-per-function": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "off",
    "accessor-pairs": "off",
  },
  overrides: [
    {
      files: ["*.js"],
      parser: "babel-eslint",
    },
    {
      files: ["*.ts"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
    },
  ],
  globals: {
    getApp: true,
    getCurrentPages: true,
    Page: true,
    Component: true,
    App: true,
    wx: true,
    Behavior: true,
  },
};
