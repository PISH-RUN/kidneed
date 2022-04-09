"use strict";

const path = require("path");

function getSeedsPath(strapi) {
  return path.join(
    process.cwd(),
    strapi.config.get("plugin.seeder.seedsPath", "seeds")
  );
}

function getSeeder(strapi, name) {
  const seeder = strapi.config.get(`plugin.seeder.seeders.${name}`);
  return seeder?.({ strapi });
}

function getLoader(strapi, name) {
  const loader = strapi.config.get(`plugin.seeder.loaders.${name}`);
  return loader?.({ strapi });
}

module.exports = {
  getSeedsPath,
  getSeeder,
  getLoader,
};
