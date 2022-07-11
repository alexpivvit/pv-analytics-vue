'use strict';

var detectIncognito = require('detect-incognito');
var Bowser = require('bowser');
var axios = require('axios');
var cookie = require('js-cookie');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var Bowser__namespace = /*#__PURE__*/_interopNamespace(Bowser);
var axios__namespace = /*#__PURE__*/_interopNamespace(axios);
var cookie__default = /*#__PURE__*/_interopDefaultLegacy(cookie);

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var SESSION_COOKIE_NAME = "_analytics_sid";
/**
// session token structure
const sessionToken = "{appToken}.{timestamp}.{random_string}";
**/

var PvAnalytics = /*#__PURE__*/function () {
  function PvAnalytics() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PvAnalytics);

    this._isIncognito = false;
    this._isInitialized = false;
    this._eventQueue = [];

    if (options.appToken) {
      this.appToken = options.appToken;
    } else {
      this._log("'appToken' is invalid");
    }

    if (options.appName) {
      this.appName = options.appName;
    } else {
      this._log("'appName' is invalid");
    }

    if (options.baseUrl) {
      this.baseUrl = options.baseUrl;
    } else {
      this._log("'baseUrl' is invalid");
    }
  }

  _createClass(PvAnalytics, [{
    key: "init",
    value: function init() {
      var _this = this;

      return detectIncognito.detectIncognito().then(function (result) {
        return _this._isIncognito = result.isPrivate;
      }).then(function () {
        return _this._startSession();
      }).then(function () {
        return _this._processQueuedEvents();
      })["catch"](function (error) {
        return _this._log(error);
      });
    }
  }, {
    key: "event",
    value: function event(eventName) {
      var userData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      eventName = (eventName || "").trim();

      if (eventName === "") {
        this._log("'eventName' is invalid");

        return;
      }

      if (_typeof(userData) !== "object") {
        this._log("'userData' is invalid");

        return;
      }

      if (this._isInitialized) {
        this._sendEvent(eventName, userData);
      } else {
        this._eventQueue.push({
          eventName: eventName,
          userData: userData
        });
      }
    }
  }, {
    key: "_processQueuedEvents",
    value: function _processQueuedEvents() {
      while (this._eventQueue.length > 0) {
        var event = this._eventQueue.shift();

        this._sendEvent(event.eventName, event.userData);
      }
    }
  }, {
    key: "_startSession",
    value: function _startSession() {
      var _this2 = this;

      var sessionToken = this._getSessionToken();

      if (sessionToken) {
        var parts = atob(sessionToken).split(".");

        if (parts.length === 3 && parts[0] === this.appToken) {
          this._isInitialized = true;
          return;
        } else {
          this._endSession();
        }
      }

      var params = {
        appToken: this.appToken,
        appName: this.appName
      };
      return axios__namespace.post("".concat(this.baseUrl, "/session-start"), params).then(function (response) {
        if (response.data) {
          _this2._isInitialized = !!response.data.sessionToken;
          cookie__default["default"].set(SESSION_COOKIE_NAME, response.data.sessionToken);
        }
      });
    }
  }, {
    key: "_endSession",
    value: function _endSession() {
      this._isInitialized = false;
      cookie__default["default"].remove(SESSION_COOKIE_NAME);
    }
  }, {
    key: "_getSessionToken",
    value: function _getSessionToken() {
      return cookie__default["default"].get(SESSION_COOKIE_NAME);
    }
  }, {
    key: "_sendEvent",
    value: function _sendEvent(eventName) {
      var _this3 = this;

      var userData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var params = {
        sessionToken: this._getSessionToken(),
        eventName: eventName,
        browser: this._getBrowserDetails(),
        timeStamp: new Date().getTime(),
        timeZone: this._getTimeZone(),
        pageUrl: this._getPageUrl(),
        referringUrl: this._getReferringUrl(),
        isIncognito: this._isIncognito,
        userData: userData
      };

      var pageLoadTime = this._pageLoadTime();

      if (pageLoadTime > 0) {
        params.pageLoadTime = pageLoadTime;
      }

      return axios__namespace.post("".concat(this.baseUrl, "/event"), params)["catch"](function (error) {
        return _this3._log(error);
      });
    }
  }, {
    key: "_pageLoadTime",
    value: function _pageLoadTime() {
      if (window && window.performance && window.performance.timing) {
        return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      }

      return null;
    }
  }, {
    key: "_getBrowserDetails",
    value: function _getBrowserDetails() {
      if (window && window.navigator) {
        return Bowser__namespace.getParser(window.navigator.userAgent).getResult();
      }

      return null;
    }
  }, {
    key: "_getTimeZone",
    value: function _getTimeZone() {
      if (Intl && Intl.DateTimeFormat) {
        return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
      }

      return null;
    }
  }, {
    key: "_getPageUrl",
    value: function _getPageUrl() {
      if (window) {
        return window.location.href;
      }

      return null;
    }
  }, {
    key: "_getReferringUrl",
    value: function _getReferringUrl() {
      if (document) {
        return document.referrer;
      }

      return null;
    }
  }, {
    key: "_log",
    value: function _log(msg) {
      console.error("[PvAnalytics] ".concat(msg));
    }
  }]);

  return PvAnalytics;
}();

PvAnalytics.EVENT_TYPE_ERROR = "error";
PvAnalytics.EVENT_TYPE_LEAVE = "leave";

var index = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    Vue.prototype.$pvAnalytics = new PvAnalytics(options);
    Vue.prototype.$pvAnalytics.init();

    if (options.trackErrors) {
      Vue.mixin({
        errorCaptured: function errorCaptured(err, vm, info) {
          if (Vue.prototype.$pvAnalytics) {
            Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_ERROR, {
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

    if (options.trackLeave && window) {
      window.addEventListener("beforeunload", function () {
        if (Vue.prototype.$pvAnalytics) {
          Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_LEAVE);
        }
      }, {
        capture: true
      });
    }
  }
};

module.exports = index;
