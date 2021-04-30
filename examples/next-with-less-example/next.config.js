// outside of this repo, this should be:
// const withLess = require("next-with-less");
const withLess = require("../../src");

module.exports = withLess({
  future: {
    webpack5: true,
  },

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
