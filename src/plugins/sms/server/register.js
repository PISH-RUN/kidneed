"use strict";

const providers = require("./providers");

module.exports = ({ strapi }) => {
  strapi.plugin("sms").providers = providers;

  strapi.plugin("sms").register = (name, provider) =>
    (strapi.plugin("sms").providers[name] = provider);
};
