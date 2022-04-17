"use strict";

const rService = () => strapi.service("api::rahche.rahche");
const rConnQuery = () =>
  strapi.query("api::rahche-connection.rahche-connection");
const rSignQuery = () => strapi.query("api::rahche-sign.rahche-sign");

const uniqBy = require("lodash/uniqBy");

module.exports = {
  async find(ctx) {
    const { rahche } = ctx.state;

    const connections = await rConnQuery().findMany({
      where: { subject: rahche.subject.id },
      populate: ["sign"],
    });

    const signs = uniqBy(connections, "sign.id").map((c) => c.sign);

    return { data: signs };
  },

  async select(ctx) {
    const { rahche } = ctx.state;
    const { body } = ctx.request;

    const { selected } = body.data;

    const existsSigns = await rSignQuery().count({
      where: { id: { $in: selected } },
    });

    if (existsSigns < selected.length) {
      return ctx.badRequest(`You have sent illegal sign ids`);
    }

    await rService().update(rahche.id, { data: { signs: selected } });

    return {
      ok: true,
    };
  },
};
