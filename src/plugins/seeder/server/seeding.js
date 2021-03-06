"use strict";

const path = require("path");
const fsHelper = require("./utils/fs-helper");
const { getSeedsPath, getSeeder, getLoader } = require("./utils/getters");

async function seedExists(file) {
  const count = await strapi
    .query("plugin::seeder.seed")
    .count({ where: { file } });

  return count > 0;
}

function seedDirHandler(seedsDirPath) {
  return async function (seedDir) {
    const seeder = getSeeder(strapi, seedDir.name);

    if (!seeder) {
      throw new Error(`Seeder not found: ${seedDir.name}`);
    }

    const seedFilesPath = path.join(seedsDirPath, seedDir.name);

    const seedFiles = await fsHelper.files(seedFilesPath);

    await seedFiles.reduce(async (acc, seedFile) => {
      await acc;
      return handleSeedFile(seedFile);
    }, Promise.resolve());

    async function handleSeedFile(seedFile) {
      const filePath = path.join(seedFilesPath, seedFile.name);
      const alreadyExist = await seedExists(filePath);

      if (alreadyExist) {
        return;
      }

      const ext = fsHelper.extname(filePath);
      const loader = getLoader(strapi, ext);

      if (!loader) {
        throw new Error(`Loader not found: ${ext}`);
      }

      await loader(seeder, filePath);
      await strapi
        .service("plugin::seeder.seed")
        .create({ data: { file: filePath } });
    }
  };
}

async function seeding({ strapi }) {
  const seedsDirPath = getSeedsPath(strapi);
  const seedsDir = (await fsHelper.dirs(seedsDirPath)).sort();

  const handler = seedDirHandler(seedsDirPath);

  await seedsDir.reduce(async (acc, seedDir) => {
    await acc;
    return handler(seedDir);
  }, Promise.resolve());
}

module.exports = seeding;
