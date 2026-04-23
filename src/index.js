import PvAnalytics from "pv-analytics";

export default {
    install(app, options = {}) {
        const analytics = new PvAnalytics(options);
        analytics.promise = analytics.init();

        app.config.globalProperties.$pvAnalytics = analytics;

        if (options.track_errors) {
            app.config.errorHandler = (err, vm, info) => {
                app.config.globalProperties.$pvAnalytics?.event(PvAnalytics.EVENT_TYPE_ERROR, {
                    message: err.toString(),
                    component: vm?.$options?.name,
                    stack: err.stack,
                    info
                });
            };
        }

        if (options.track_leave && typeof window === "object") {
            window.addEventListener("beforeunload", () => {
                app.config.globalProperties.$pvAnalytics?.event(PvAnalytics.EVENT_TYPE_LEAVE);
            }, { capture: true });
        }

        if (options.track_clicks && typeof window === "object") {
            window.addEventListener("click", (e) => {
                app.config.globalProperties.$pvAnalytics?.event(PvAnalytics.EVENT_TYPE_CLICK, {
                    html: e.target.outerHTML,
                    class: e.target.className
                });
            });
        }
    }
};
