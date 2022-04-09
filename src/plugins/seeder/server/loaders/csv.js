"use strict";

const fs = require("fs/promises");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");

async function stream(path) {
  const fd = await fs.open(path);
  return fd.createReadStream();
}

async function parser(path, config) {
  return (await stream(path)).pipe(parse(config));
}

const loader = (config) => async (seeder, path) => {
  const pr = await parser(path, config);

  pr.on("readable", async function () {
    let record;
    while ((record = pr.read()) !== null) {
      await seeder.fromCSV(record);
    }
  });

  await finished(pr);
};

module.exports = ({ strapi }) => {
  const config = strapi.config.get("plugin.seeder.options.csv", {
    columns: true,
  });

  return loader(config);
};
