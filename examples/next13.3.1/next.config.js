// the following 2 lines are specific to this repo. in your project use next-with-less directly
// const withLess = require("next-with-less");
const withLess = require("../../src");
withLess.patchNext(require("next/dist/build/webpack/config/blocks/css"));

/** @type {import('next').NextConfig} */
const nextConfig = withLess({
  reactStrictMode: true,

  lessLoaderOptions: {
    // it's possible to use additionalData or modifyVars for antd theming
    // read more @ https://ant.design/docs/react/customize-theme
    additionalData: (content) => `${content}\n@border-radius-base: 10px;`,

    lessOptions: {
      modifyVars: {
        "primary-color": "#9900FF",
      },
    },
  },
});

module.exports = nextConfig
