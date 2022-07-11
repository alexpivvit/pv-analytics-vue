**Usage example**
```
import PvAnalytics from "pv-analytics";

Vue.use(PvAnalytics, {
    appToken: "test-token",
    appName: "Test App",
    baseUrl: "https://example.com",
    trackErrors: true,
    trackLeave: true
});

new Vue({
    mounted() {
        this.$pvAnalytics.event("test", {
            "profileID": 12345
        });
    },
    render: h => h(App),
    router,
    store
}).$mount("#v-app");
```