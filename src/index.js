
import PvAnalytics from "pv-analytics";

export default {
    install(Vue, options = {}) {
        Vue.prototype.$pvAnalytics = new PvAnalytics(options);
        Vue.prototype.$pvAnalytics.promise = Vue.prototype.$pvAnalytics.init();

        if (options.track_errors) {
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

        if (options.track_leave && typeof window === "object") {
            window.addEventListener("beforeunload", () => {
                if (Vue.prototype.$pvAnalytics) {
                    Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_LEAVE);
                }
            }, {capture: true});
        }

        if (options.track_clicks && typeof window === "object") {
            window.addEventListener("click", (e) => {
                if (Vue.prototype.$pvAnalytics) {
                    Vue.prototype.$pvAnalytics.event(PvAnalytics.EVENT_TYPE_CLICK, {
                        html: e.target.outerHTML,
                        class: e.target.className
                    });
                }
            });
        }
    }
};
