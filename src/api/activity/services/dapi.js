"use strict";

const dapi = require("../../../utils/dapi");
const flatStrapiResponse = require("../../../utils/flat-strapi-response");

module.exports = ({ strapi }) => ({
  async contents(ids, fields = ["title"]) {
    const result = await dapi.contents(ids, fields);
    return flatStrapiResponse(result.data).reduce((acc, curr) => {
      return { ...acc, [curr.id]: curr };
    }, {});
  },

  async editions(content, tag) {
    const edition = await dapi.editions(content, tag);

    return edition?.data;
  },
});
