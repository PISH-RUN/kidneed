"use strict";

const uniqBy = require("lodash/uniqBy");

const rConnQuery = (strapi) =>
  strapi.query("api::rahche-connection.rahche-connection");

const rQuery = (strapi) => strapi.service("api::rahche.rahche");

module.exports = ({ strapi }) => ({
  async approaches(rahche, { populate } = {}) {
    console.log({ old: rahche });
    if (
      !rahche.subject ||
      !rahche.signs?.length < 1 ||
      !rahche.roots?.length < 1
    ) {
      rahche = await rQuery(strapi).findOne(rahche.id, { populate: "*" });
    }

    console.log({ newr: rahche });

    const connections = await rConnQuery(strapi).findMany({
      where: {
        subject: rahche.subject.id,
        sign: { id: { $in: rahche.signs.map((s) => s.id) } },
        root: { id: { $in: rahche.roots.map((r) => r.id) } },
      },
      populate: [...(populate || []), "approach"],
    });

    const approaches = uniqBy(connections, "approach.id").map(
      (c) => c.approach
    );

    return { rahche, approaches };
  },
});
