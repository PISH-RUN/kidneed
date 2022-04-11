const omit = require("lodash/omit");
const routes = require("./routes/routes");
const authController = require("./controllers/auth-controller");
const userController = require("./controllers/user-controller");
const extendedService = require("./services/extended");

module.exports = (plugin) => {
  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    ...authController,
  };

  plugin.config = omit(plugin.config, "layout");

  plugin.routes["content-api"].routes.push(...routes.routes);
  plugin.services.extended = extendedService;

  const originalMe = plugin.controllers.user.me.bind({});
  plugin.controllers.user.me = async (ctx) => {
    await originalMe(ctx);
    ctx.body = {
      ...ctx.body,
      ...(await userController.unreadNotifcations(ctx)),
    };
  };

  return plugin;
};
