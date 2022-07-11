
import PvAnalytics from "./PvAnalytics";

export default {
    install(Vue, options = {}) {
        Vue.prototype.$pvAnalytics = new PvAnalytics(options);
        Vue.prototype.$pvAnalytics.init();

        if (options.trackErrors) {
            Vue.mixin({
                errorCaptured(err, vm, info) {
                    if (Vue.prototype.$pvAnalytics) {
                        Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_ERROR, {
                            message: err.toString(),
                            componennt: vm.$options.name,
                            stack: err.stack,
                            info
                        });
                    }

                    return true;
                }
            });
        }

        if (options.trackLeave && window) {
            window.addEventListener("beforeunload", () => {
                if (Vue.prototype.$pvAnalytics) {
                    Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_LEAVE);
                }
            }, {capture: true});
        }

        if (options.trackClicks && click) {
            window.addEventListener("click", () => {
                if (Vue.prototype.$pvAnalytics) {
                    Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_CLICK, {
                        html: e.target.outerHTML,
                        class: e.target.className
                    });
                }
            });
        }
        window.document.addEventListener("click", (e) => console.log(e.target))
    }
};
