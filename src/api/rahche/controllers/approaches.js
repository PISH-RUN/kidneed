"use strict";

const rConnQuery = () =>
  strapi.query("api::rahche-connection.rahche-connection");

module.exports = {
  async find(ctx) {
    const { rahche } = ctx.state;

    if (rahche.roots?.length < 1) {
      return ctx.badRequest(
        `You need to select roots before getting approaches`
      );
    }

    const connections = await rConnQuery().findMany({
      where: {
        subject: rahche.subject.id,
        sign: { id: { $in: rahche.signs.map((s) => s.id) } },
        root: { id: { $in: rahche.roots.map((r) => r.id) } },
      },
      populate: ["approach", "approach.voice"],
    });

    const approachs = connections.map((c) => c.approach);

    return { data: approachs };
  },
};
