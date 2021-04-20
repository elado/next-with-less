# `next-with-less`

> [Next.js](https://nextjs.org/) + [Less CSS](https://lesscss.org/) Support

Next.js supports SASS/SCSS, but not Less. This plugin adds Less support by duplicating SASS webpack rules and adding support for `.less` files with `less-loader`.
It mimics the exact behavior of CSS extraction/css-modules/errors/client/server of SASS.

Tested on `next@10.1.3` with `webpack5`, and `antd@4.15.x`.

## Install

```sh
yarn add next-with-less

npm i next-with-less
```

Peer dependencies to install: `less` `less-loader`.

## Usage

```js
// next.config.js
const withLess = require("next-with-less");

module.exports = withLess({
  future: {
    webpack5: true,
  },

  lessOptions: {
    /* ... */
  },
});
```

### Usage with [`next-compose-plugins`](https://github.com/cyrilwanner/next-compose-plugins)

```js
// next.config.js
const withPlugins = require("next-compose-plugins");

const withLess = require("next-with-less");

const plugins = [
  withLess,
  {
    lessOptions: {
      /* ... */
    },
  },
];

module.exports = withPlugins(plugins, {
  future: {
    webpack5: true,
  },
});
```
