// outside of this repo, this should be:
// const withLess = require("next-with-less");
const withLess = require("../../");

module.exports = withLess({
  future: {
    webpack5: true,
  },
});
