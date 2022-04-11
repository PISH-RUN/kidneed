'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('sms')
      .service('myService')
      .getWelcomeMessage();
  },
};
