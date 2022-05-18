const { resolve } = require('path');

module.exports = {
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": resolve(__dirname),
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    // "project": ["./tsconfig.json"],
    "sourceType": "module"
  },
  "plugins": [
    "react-hooks",
    "@typescript-eslint",
    "prettier"
  ],
  "ignorePatterns": ["temp.js", ".eslintrc.js", "**/*.js", "/node_modules"],
  "rules": {
    "prettier/prettier": "error",
    "react-hooks/rules-of-hooks": "error",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react-hooks/exhaustive-deps": "warn",
    "import/prefer-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    // "import/extensions": [
    //   "error",
    //   "ignorePackages",
    //   {
    //     "ts": "never",
    //     "tsx": "never"
    //   }
    // ],
    // "import/no-extraneous-dependencies": [
    //   "error",
    //   {
    //     "devDependencies":
    //     ["**/*.spec.ts", "**/*.spec.tsx"]
    //   }
    // ],
    // "import/no-extraneous-dependencies": [
    //   "error", {"devDependencies": true}
    // ]
  },
  "settings": {
    "import/resolver": {
      "typescript": {}
    }
  },
  "root": true
}
