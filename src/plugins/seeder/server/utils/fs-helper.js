"use strict";

const fs = require("fs/promises");
const path = require("path");

async function files(path) {
  return (await fs.readdir(path, { withFileTypes: true })).filter((f) =>
    f.isFile()
  );
}

async function dirs(path) {
  return (await fs.readdir(path, { withFileTypes: true })).filter((f) =>
    f.isDirectory()
  );
}

function extname(filePath) {
  return path.extname(filePath).slice(1);
}

module.exports = {
  files,
  dirs,
  extname,
};
