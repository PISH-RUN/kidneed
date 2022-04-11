"use strict";

const messenger = (strapi) => ({
  provider: strapi.plugin("sms").provider,
  actions: {},
  async send(data) {
    return await this.provider.send(data);
  },

  async sendBulk(data) {
    return await this.provider.sendBulk(data);
  },

  register(name, action) {
    this.actions[name] = action[this.provider.name](this.provider);
  },
});

const messengerHandler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }

    return target.actions[prop];
  },
};

module.exports = ({ strapi }) => new Proxy(messenger(strapi), messengerHandler);
