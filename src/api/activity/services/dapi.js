"use strict";

const dapi = require("../../../utils/dapi");
const flatStrapiResponse = require("../../../utils/flat-strapi-response");

module.exports = ({ strapi }) => ({
  async entities(ids, fields = ["title"], contents) {
    const result = await dapi.entities(ids, fields, contents);
    return flatStrapiResponse(result.data).reduce((acc, curr) => {
      return { ...acc, [curr.id]: curr };
    }, {});
  },

  async editions(entity, tag) {
    const edition = await dapi.editions(entity, tag);

    return edition?.data;
  },
});
