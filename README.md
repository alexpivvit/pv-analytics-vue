**Usage example**
```
import PvAnalytics from "pv-analytics";

Vue.use(PvAnalytics, {
    app_token: "test-token",
    app_name: "Test App",
    base_url: "https://example.com",
    track_errors: true,
    track_leave: true,
    track_clicks: true,
    debug: true
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