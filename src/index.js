const cloneDeep = require("clone-deep");

// this plugin finds next.js's sass rules and duplicates them with less
// it mimics the exact behavior of CSS extraction/modules/client/server of SASS
// tested on next@11.0.1 with webpack@5

const addLessToRegExp = (rx) =>
  new RegExp(rx.source.replace("|sass", "|sass|less"), rx.flags);

function withLess(nextConfig) {
  return Object.assign({}, nextConfig, {
    /** 
     * @function webpack
     * @type {import('next').NextConfig["webpack"]}
     * @param {import('webpack').Configuration} config
     * @returns {import('webpack').Configuration}
    * */
    webpack(config, opts) {
      // there are 2 relevant sass rules in next.js - css modules and global css
      let sassModuleRules = [];
      // global sass rule (does not exist in server builds)
      let sassGlobalRules = [];

      const cssRule = config.module.rules.find(({ oneOf }) => !!oneOf).oneOf

      const addLessToRuleTest = (test) => {
        if (Array.isArray(test)) {
          return test.map((rx) => addLessToRegExp(rx));
        } else {
          return addLessToRegExp(test);
        }
      };

      cssRule.forEach((rule, i) => {
        if (rule.use?.loader === 'error-loader') {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.use?.loader?.includes('file-loader')) {
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.use?.includes?.('ignore-loader')) {
          rule.test = addLessToRuleTest(rule.test);
        } else if (rule.test?.source === '\\.module\\.(scss|sass)$') {
          sassModuleRules.push(rule);
        } else if (rule.test?.source === '(?<!\\.module)\\.(scss|sass)$') {
          sassGlobalRules.push(rule);
        } else if (rule.issuer?.source === "\\.(css|scss|sass)$" && rule.type === 'asset/resource') {
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.use?.loader?.includes('next-flight-css-loader')) {
          rule.test = addLessToRuleTest(rule.test);
        }
      });

      const lessLoader = {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              "@url": `/static/images`
            },
          },
        },
      };

      let lessModuleRules = cloneDeep(sassModuleRules);

      const configureLessRule = (rule) => {
        rule.test = new RegExp(rule.test.source.replace('(scss|sass)', 'less'));
        // replace sass-loader (last entry) with less-loader
        rule.use.splice(-1, 1, lessLoader);
      };

      lessModuleRules.forEach((lessModuleRule, index) => {
        configureLessRule(lessModuleRule);
        cssRule.splice(cssRule.indexOf(sassModuleRules[index]) + 1, 0, lessModuleRule);
      });

      if (sassGlobalRules) {
        let lessGlobalRules = cloneDeep(sassGlobalRules);
        lessGlobalRules.forEach((lessGlobalRule, index) => {
          configureLessRule(lessGlobalRule);
          cssRule.splice(cssRule.indexOf(sassGlobalRules[index]) + 1, 0, lessGlobalRule);
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, opts);
      }

      return config;
    },
  });
}

module.exports = withLess;
