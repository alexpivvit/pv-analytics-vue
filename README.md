**Usage example**
```
import PvAnalytics from "pv-analytics";

Vue.use(PvAnalytics, {
    app: app,                                       // VueJS instance
    app_token: "test-token",                        // App token
    app_name: "Test App",                           // App name
    base_url: "https://example.com",                // Base API URL
    track_errors: true,                             // Enable automatic error tracking
    track_leave: true,                              // Enable automatic leave tracking
    track_clicks: true,                             // Enable automatic click tracking
    preserve_utm: true,                             // Preserve utm attributes during session
    debug: true,                                    // Enable console logger
    retry_on_failure: false,                        // Retry on failure
    retry_delay: 250,                               // Retry delay
    retry_attempts: 1,                              // Retry attempts
    session_domain: window.location.host,           // Session domain
    error_callback: (error) => {/* handle error */},// Error callback handler
    promise: new Promise((resolve) => resolve()),   // Promise
    inactivity_timeout: 30*60                       // Restart a session after 1800 seconds (30 minutes) of inactivity
    is_enabled: true                                // Turn the plugin on/off
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