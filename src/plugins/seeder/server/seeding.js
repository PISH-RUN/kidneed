"use strict";

const path = require("path");
const fsHelper = require("./utils/fs-helper");
const { getSeedsPath, getSeeder, getLoader } = require("./utils/getters");

function seedDirHandler(seedsDirPath) {
  return async function (seedDir) {
    const seeder = getSeeder(strapi, seedDir.name);

    if (!seeder) {
      throw new Error(`Seeder not found: ${seedDir.name}`);
    }

    const seedFilesPath = path.join(seedsDirPath, seedDir.name);

    const seedFiles = await fsHelper.files(seedFilesPath);
    await seedFiles.forEach(async (seedFile) => {
      const filePath = path.join(seedFilesPath, seedFile.name);
      const ext = fsHelper.extname(filePath);

      const loader = getLoader(strapi, ext);

      if (!loader) {
        throw new Error(`Loader not found: ${ext}`);
      }

      await loader(seeder, filePath);
    });
  };
}

async function seeding({ strapi }) {
  const seedsDirPath = getSeedsPath(strapi);
  const seedsDir = await fsHelper.dirs(seedsDirPath);

  await seedsDir.forEach(seedDirHandler(seedsDirPath));
}

module.exports = seeding;
