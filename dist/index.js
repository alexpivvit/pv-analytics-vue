'use strict';

var PvAnalytics = require('pv-analytics');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var PvAnalytics__default = /*#__PURE__*/_interopDefaultLegacy(PvAnalytics);

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var index = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Vue.prototype.$pvAnalytics = new PvAnalytics__default["default"](options);
    Vue.prototype.$pvAnalytics.promise = Vue.prototype.$pvAnalytics.init();

    if (options.track_errors) {
      Vue.mixin({
        errorCaptured: function errorCaptured(err, vm, info) {
          if (Vue.prototype.$pvAnalytics) {
            Vue.prototype.$pvAnalytics.event(PvAnalytics__default["default"].EVENT_TYPE_ERROR, {
              message: err.toString(),
              componennt: vm.$options.name,
              stack: err.stack,
              info: info
            });
          }

          return true;
        }
      });
    }

    if (options.track_leave && (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
      window.addEventListener("beforeunload", function () {
        if (Vue.prototype.$pvAnalytics) {
          Vue.prototype.$pvAnalytics.event(PvAnalytics__default["default"].EVENT_TYPE_LEAVE);
        }
      }, {
        capture: true
      });
    }

    if (options.track_clicks && (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
      window.addEventListener("click", function (e) {
        if (Vue.prototype.$pvAnalytics) {
          Vue.prototype.$pvAnalytics.event(PvAnalytics__default["default"].EVENT_TYPE_CLICK, {
            html: e.target.outerHTML,
            "class": e.target.className
          });
        }
      });
    }
  }
};

module.exports = index;
