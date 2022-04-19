"use strict";

const uniqBy = require("lodash/uniqBy");

const rConnQuery = (strapi) =>
  strapi.query("api::rahche-connection.rahche-connection");

const rQuery = (strapi) => strapi.service("api::rahche.rahche");

module.exports = ({ strapi }) => ({
  async approaches(rahche, { populate } = {}) {
    if (
      !rahche.subject ||
      !rahche.signs?.length < 1 ||
      !rahche.roots?.length < 1
    ) {
      rahche = await rQuery(strapi).findOne(rahche.id, { populate: "*" });
    }

    const connections = await rConnQuery(strapi).findMany({
      where: {
        $and: [
          { subject: rahche.subject.id },
          { sign: { id: { $in: rahche.signs.map((s) => s.id) } } },
          { root: { id: { $in: rahche.roots.map((r) => r.id) } } },
        ],
      },
      populate: [...(populate || []), "approach"],
    });

    const approaches = uniqBy(connections, (c) => c.approach.id).map(
      (c) => c.approach
    );

    return { rahche, approaches };
  },
});
