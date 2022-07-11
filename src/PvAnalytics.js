
import {detectIncognito} from "detect-incognito";
import * as Bowser from "bowser";
import * as axios from "axios";
import cookie from "js-cookie";

const SESSION_COOKIE_NAME = "_analytics_sid";

/**
// session token structure
const sessionToken = "{appToken}.{timestamp}.{random_string}";
**/

class PvAnalytics {
    constructor(options = {}) {
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

    init() {
        return detectIncognito()
            .then((result) => this._isIncognito = result.isPrivate)
            .then(() => this._startSession())
            .then(() => this._processQueuedEvents())
            .catch((error) => this._log(error));
    }

    event(eventName, userData = {}) {
        eventName = (eventName || "").trim();

        if (eventName === "") {
            this._log("'eventName' is invalid");
            return;
        }

        if (typeof userData !== "object") {
            this._log("'userData' is invalid");
            return;
        }

        if (this._isInitialized) {
            this._sendEvent(eventName, userData);
        } else {
            this._eventQueue.push({eventName, userData});
        }
    }

    _processQueuedEvents() {
        while (this._eventQueue.length > 0) {
            const event = this._eventQueue.shift();
            this._sendEvent(event.eventName, event.userData);
        }
    }

    _startSession() {
        const sessionToken = this._getSessionToken();

        if (sessionToken) {
            const parts = atob(sessionToken).split(".");

            if (parts.length === 3 && parts[0] === this.appToken) {
                this._isInitialized = true;
                return;
            } else {
                this._endSession();
            }
        }

        const params = {
            appToken: this.appToken,
            appName: this.appName
        };

        return axios.post(`${this.baseUrl}/session-start`, params)
            .then((response) => {
                if (response.data) {
                    this._isInitialized = !!response.data.sessionToken;
                    cookie.set(SESSION_COOKIE_NAME, response.data.sessionToken);
                }
            });
    }

    _endSession() {
        this._isInitialized = false;
        cookie.remove(SESSION_COOKIE_NAME);
    }

    _getSessionToken() {
        return cookie.get(SESSION_COOKIE_NAME);
    }

    _sendEvent(eventName, userData = {}) {
        const params = {
            sessionToken: this._getSessionToken(),
            eventName,
            browser: this._getBrowserDetails(),
            timeStamp: (new Date()).getTime(),
            timeZone: this._getTimeZone(),
            pageUrl: this._getPageUrl(),
            referringUrl: this._getReferringUrl(),
            isIncognito: this._isIncognito,
            userData
        };

        const pageLoadTime = this._pageLoadTime();

        if (pageLoadTime > 0) {
            params.pageLoadTime = pageLoadTime;
        }

        return axios.post(`${this.baseUrl}/event`, params)
            .catch((error) => this._log(error));
    }

    _pageLoadTime() {
        if (window && window.performance && window.performance.timing) {
            return window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        }

        return null;
    }

    _getBrowserDetails() {
        if (window && window.navigator) {
            return Bowser.getParser(window.navigator.userAgent)
                .getResult();
        }

        return null;
    }

    _getTimeZone() {
        if (Intl && Intl.DateTimeFormat) {
            return Intl && Intl.DateTimeFormat().resolvedOptions().timeZone;
        }

        return null;
    }

    _getPageUrl() {
        if (window) {
            return window.location.href;
        }

        return null;
    }

    _getReferringUrl() {
        if (document) {
            return document.referrer;
        }

        return null;
    }

    _log(msg) {
        console.error(`[PvAnalytics] ${msg}`);
    }
}

PvAnalytics.EVENT_TYPE_ERROR = "_error";
PvAnalytics.EVENT_TYPE_LEAVE = "_leave";
PvAnalytics.EVENT_TYPE_CLICK = "_click";

export default PvAnalytics;
