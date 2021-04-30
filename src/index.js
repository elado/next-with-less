const cloneDeep = require("clone-deep");

// this plugin finds next.js's sass rules and duplicates them with less
// it mimics the exact behavior of CSS extraction/modules/client/server of SASS
// tested on next 10.1.3 with webpack5

function withLess({ lessLoaderOptions = {}, ...nextConfig }) {
  return Object.assign({}, nextConfig, {
    webpack(config, opts) {
      // there are 2 relevant sass rules in next.js - css modules and global css
      let sassModuleRule;
      // global sass rule (does not exist in server builds)
      let sassGlobalRule;

      const cssRule = config.module.rules.find(
        (rule) => rule.oneOf?.[0]?.options?.__next_css_remove
      );

      const addLessToRegExp = (rx) =>
        new RegExp(rx.source.replace("|sass", "|sass|less"), rx.flags);

      const addLessToRuleTest = (test) => {
        if (Array.isArray(test)) {
          return test.map((rx) => addLessToRegExp(rx));
        } else {
          return addLessToRegExp(test);
        }
      };

      cssRule.oneOf.forEach((rule) => {
        if (rule.options?.__next_css_remove) return;

        if (rule.use?.loader === "error-loader") {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.use?.loader?.includes("file-loader")) {
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.use?.includes?.("ignore-loader")) {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.test?.source === "\\.module\\.(scss|sass)$") {
          sassModuleRule = rule;
        } else if (rule.test?.source === "(?<!\\.module)\\.(scss|sass)$") {
          sassGlobalRule = rule;
        }
      });

      const lessLoader = {
        loader: "less-loader",
        options: {
          ...lessLoaderOptions,
          lessOptions: {
            javascriptEnabled: true,
            ...lessLoaderOptions.lessOptions,
          },
        },
      };

      let lessModuleRule = cloneDeep(sassModuleRule);

      const configureLessRule = (rule) => {
        rule.test = new RegExp(rule.test.source.replace("(scss|sass)", "less"));
        // replace sass-loader (last entry) with less-loader
        rule.use.splice(-1, 1, lessLoader);
      };

      configureLessRule(lessModuleRule);
      cssRule.oneOf.splice(
        cssRule.oneOf.indexOf(sassModuleRule) + 1,
        0,
        lessModuleRule
      );

      if (sassGlobalRule) {
        let lessGlobalRule = cloneDeep(sassGlobalRule);
        configureLessRule(lessGlobalRule);
        cssRule.oneOf.splice(
          cssRule.oneOf.indexOf(sassGlobalRule) + 1,
          0,
          lessGlobalRule
        );
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, opts);
      }

      return config;
    },
  });
}

module.exports = withLess;
