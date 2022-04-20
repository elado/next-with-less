"use strict";

var _excluded = ["lessLoaderOptions"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var path = require("path");

var cloneDeep = require("clone-deep"); // this plugin finds next.js's sass rules and duplicates them with less
// it mimics the exact behavior of CSS extraction/modules/client/server of SASS
// tested on next@11.0.1 with webpack@5


var addLessToRegExp = function addLessToRegExp(rx) {
  return new RegExp(rx.source.replace("|sass", "|sass|less"), rx.flags);
};

function patchNextCSSWithLess() {
  var nextCSSModule = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : require("next/dist/build/webpack/config/blocks/css");
  // monkey patch next's regexLikeCss to include less files
  // overrides https://github.com/vercel/next.js/blob/e8a9bd19967c9f78575faa7d38e90a1270ffa519/packages/next/build/webpack/config/blocks/css/index.ts#L17
  // so https://github.com/vercel/next.js/blob/e8a9bd19967c9f78575faa7d38e90a1270ffa519/packages/next/build/webpack-config.ts#L54
  // has less extension as well
  nextCSSModule.regexLikeCss = addLessToRegExp(nextCSSModule.regexLikeCss);
}

patchNextCSSWithLess();

function withLess(_ref) {
  var _ref$lessLoaderOption = _ref.lessLoaderOptions,
      lessLoaderOptions = _ref$lessLoaderOption === void 0 ? {} : _ref$lessLoaderOption,
      nextConfig = _objectWithoutProperties(_ref, _excluded);

  return Object.assign({}, nextConfig, {
    /**
     * @param {import('webpack').Configuration} config
     * @param {*} options
     * @returns {import('webpack').Configuration}
     */
    webpack: function webpack(config, opts) {
      // there are 2 relevant sass rules in next.js - css modules and global css
      var sassModuleRule; // global sass rule (does not exist in server builds)

      var sassGlobalRule;

      var isNextSpecialCSSRule = function isNextSpecialCSSRule(rule) {
        var _rule$options;

        return (// next >= 12.0.7
          rule[Symbol["for"]("__next_css_remove")] || ( // next < 12.0.7
          (_rule$options = rule.options) === null || _rule$options === void 0 ? void 0 : _rule$options.__next_css_remove)
        );
      };

      var cssRule = config.module.rules.find(function (rule) {
        var _rule$oneOf;

        return (_rule$oneOf = rule.oneOf) === null || _rule$oneOf === void 0 ? void 0 : _rule$oneOf.find(isNextSpecialCSSRule);
      });

      if (!cssRule) {
        throw new Error("Could not find next.js css rule. Please ensure you are using a supported version of next.js");
      }

      var addLessToRuleTest = function addLessToRuleTest(test) {
        if (Array.isArray(test)) {
          return test.map(function (rx) {
            return addLessToRegExp(rx);
          });
        } else {
          return addLessToRegExp(test);
        }
      };

      cssRule.oneOf.forEach(function (rule) {
        var _rule$options2, _rule$use, _rule$use2, _rule$use2$loader, _rule$use3, _rule$use3$includes, _rule$test, _rule$test2;

        if ((_rule$options2 = rule.options) !== null && _rule$options2 !== void 0 && _rule$options2.__next_css_remove) return;

        if (((_rule$use = rule.use) === null || _rule$use === void 0 ? void 0 : _rule$use.loader) === "error-loader") {
          rule.test = addLessToRuleTest(rule.test);
        } else if ((_rule$use2 = rule.use) !== null && _rule$use2 !== void 0 && (_rule$use2$loader = _rule$use2.loader) !== null && _rule$use2$loader !== void 0 && _rule$use2$loader.includes("file-loader")) {
          // url() inside .less files - next <= 11
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if (rule.type === "asset/resource") {
          // url() inside .less files - next >= 12
          rule.issuer = addLessToRuleTest(rule.issuer);
        } else if ((_rule$use3 = rule.use) !== null && _rule$use3 !== void 0 && (_rule$use3$includes = _rule$use3.includes) !== null && _rule$use3$includes !== void 0 && _rule$use3$includes.call(_rule$use3, "ignore-loader")) {
          rule.test = addLessToRuleTest(rule.test);
        } else if (((_rule$test = rule.test) === null || _rule$test === void 0 ? void 0 : _rule$test.source) === "\\.module\\.(scss|sass)$") {
          sassModuleRule = rule;
        } else if (((_rule$test2 = rule.test) === null || _rule$test2 === void 0 ? void 0 : _rule$test2.source) === "(?<!\\.module)\\.(scss|sass)$") {
          sassGlobalRule = rule;
        }
      });
      var lessLoader = {
        loader: "less-loader",
        options: _objectSpread(_objectSpread({}, lessLoaderOptions), {}, {
          lessOptions: _objectSpread({
            javascriptEnabled: true
          }, lessLoaderOptions.lessOptions)
        })
      };
      var lessModuleRule = cloneDeep(sassModuleRule);

      var configureLessRule = function configureLessRule(rule) {
        rule.test = new RegExp(rule.test.source.replace("(scss|sass)", "less")); // replace sass-loader (last entry) with less-loader

        rule.use.splice(-1, 1, lessLoader); // Find css-loader and insert fix-relative-urls-loader after it

        var cssLoaderIndex = rule.use.findIndex(function (moduleLoader) {
          return (moduleLoader === null || moduleLoader === void 0 ? void 0 : moduleLoader.loader) && moduleLoader.loader.includes('\\css-loader');
        });

        if (cssLoaderIndex > 0) {
          rule.use.splice(cssLoaderIndex, 0, {
            loader: path.resolve(__dirname, './../lib/fix-relative-urls-loader.js'),
            options: {}
          });
        }
      };

      configureLessRule(lessModuleRule);
      cssRule.oneOf.splice(cssRule.oneOf.indexOf(sassModuleRule) + 1, 0, lessModuleRule);

      if (sassGlobalRule) {
        var lessGlobalRule = cloneDeep(sassGlobalRule);
        configureLessRule(lessGlobalRule);
        cssRule.oneOf.splice(cssRule.oneOf.indexOf(sassGlobalRule) + 1, 0, lessGlobalRule);
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, opts);
      }

      return config;
    }
  });
}

module.exports = withLess;
module.exports.patchNext = patchNextCSSWithLess;