# `next-with-less`

> [Next.js](https://nextjs.org/) + [Less CSS](https://lesscss.org/) Support

**_Hopefully this plugin will be unnecessary soon - when https://github.com/vercel/next.js/pull/23185 merges_**

Next.js supports SASS/SCSS, but not Less. This plugin adds Less support by duplicating SASS webpack rules and adding support for `.less` files with `less-loader`.
It mimics the exact behavior of CSS extraction/css-modules/errors/client/server of SASS.

⚠️ _**Use with caution - Next.js implementation can chance in any version, and the monkey patching may not work anymore.**_

Tested with `next@10.1.3`/`next@10.2` with `webpack@5`, and `antd@4.15.x`.

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

  lessLoaderOptions: {
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
    lessLoaderOptions: {
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

### Customize `antd` theme

To override some of `antd` [default variables](https://ant.design/docs/react/customize-theme), just add them under `lessLoaderOptions.lessOptions.modifyVars`:

```js
// next.config.js
const withLess = require("next-with-less");

module.exports = withLess({
  future: {
    webpack5: true,
  },

  lessLoaderOptions: {
    /* ... */
    lessOptions: {
      /* ... */
      modifyVars: {
        'primary-color': '#9900FF',
        'border-radius-base': '2px',
        /* ... */
      },
    },
  },
});
```
