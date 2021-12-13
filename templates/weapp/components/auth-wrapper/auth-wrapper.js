const { loginAuth } = require("../../libs/login-auth");
const { throttle } = require("../../libs/utils");

Component({

  methods: {
    onClick: throttle(async () => {
      try {
        await loginAuth.checkAuth();
        this.triggerEvent("click");
      } catch (e) {
        await loginAuth.continueAuth();
      }
    }, 1000),
  },
});
