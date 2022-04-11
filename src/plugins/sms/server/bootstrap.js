"use strict";

module.exports = async ({ strapi }) => {
  const provider = strapi.config.get("plugin.sms.provider");
  const providersOptions = strapi.config.get("plugin.sms.providersOptions");

  const providers = strapi.plugin("sms").providers;

  strapi.plugin("sms").provider = await providers[provider].init(
    providersOptions[provider]
  );

  strapi.plugin("sms").provider.name = provider;
};
