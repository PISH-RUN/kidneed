const omit = require("lodash/omit");
const routes = require("./routes/routes");
const authController = require("./controllers/auth-controller");
const userController = require("./controllers/user-controller");
const notificationController = require("./controllers/notification-controller");
const meController = require("./controllers/me-controller");
const extendedService = require("./services/extended");

module.exports = (plugin) => {
  modifyConfig(plugin);
  modifyControllers(plugin);

  modifyRoutes(plugin);

  modifyServices(plugin);

  return plugin;
};

function modifyConfig(plugin) {
  plugin.config = omit(plugin.config, "layout");
}

function modifyControllers(plugin) {
  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    ...authController,
  };

  plugin.controllers.user = userController.overwrite({
    ...plugin.controllers.user,
  });

  plugin.controllers.notification = notificationController;
  plugin.controllers.me = meController;
}

function modifyRoutes(plugin) {
  plugin.routes["content-api"].routes.unshift(...routes.unshift);
  plugin.routes["content-api"].routes.push(...routes.push);
}

function modifyServices(plugin) {
  plugin.services.extended = extendedService;
}
