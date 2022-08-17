**Usage example**
```
import PvAnalytics from "pv-analytics";

Vue.use(PvAnalytics, {
    app: app,                           // VueJS instance
    app_token: "test-token",            // App token
    app_name: "Test App",               // App name
    base_url: "https://example.com",    // Base API URL
    track_errors: true,                 // Enable automatic error tracking
    track_leave: true,                  // Enable automatic leave tracking
    track_clicks: true,                 // Enable automatic click tracking
    preserve_utm: true,                 // Preserve utm attributes during session
    debug: true                         // Enable console logger
});

new Vue({
    mounted() {
        this.$pvAnalytics.event("test", {
            "profile_id": 12345
        });
    },
    render: h => h(App)
}).$mount("#v-app");
```