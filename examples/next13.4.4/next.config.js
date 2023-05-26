// Replace the following line with `const withLess = require("next-with-less")`
const withLess = require("../../src");

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
