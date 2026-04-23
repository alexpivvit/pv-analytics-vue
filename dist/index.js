'use strict';

var PvAnalytics = require('pv-analytics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PvAnalytics__default = /*#__PURE__*/_interopDefaultLegacy(PvAnalytics);

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

var index = {
  install: function install(app) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var analytics = new PvAnalytics__default["default"](options);
    analytics.promise = analytics.init();
    app.config.globalProperties.$pvAnalytics = analytics;
    if (options.track_errors) {
      app.config.errorHandler = function (err, vm, info) {
        var _app$config$globalPro, _vm$$options;
        (_app$config$globalPro = app.config.globalProperties.$pvAnalytics) === null || _app$config$globalPro === void 0 ? void 0 : _app$config$globalPro.event(PvAnalytics__default["default"].EVENT_TYPE_ERROR, {
          message: err.toString(),
          component: vm === null || vm === void 0 ? void 0 : (_vm$$options = vm.$options) === null || _vm$$options === void 0 ? void 0 : _vm$$options.name,
          stack: err.stack,
          info: info
        });
      };
    }
    if (options.track_leave && (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
      window.addEventListener("beforeunload", function () {
        var _app$config$globalPro2;
        (_app$config$globalPro2 = app.config.globalProperties.$pvAnalytics) === null || _app$config$globalPro2 === void 0 ? void 0 : _app$config$globalPro2.event(PvAnalytics__default["default"].EVENT_TYPE_LEAVE);
      }, {
        capture: true
      });
    }
    if (options.track_clicks && (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
      window.addEventListener("click", function (e) {
        var _app$config$globalPro3;
        (_app$config$globalPro3 = app.config.globalProperties.$pvAnalytics) === null || _app$config$globalPro3 === void 0 ? void 0 : _app$config$globalPro3.event(PvAnalytics__default["default"].EVENT_TYPE_CLICK, {
          html: e.target.outerHTML,
          "class": e.target.className
        });
      });
    }
  }
};

module.exports = index;
