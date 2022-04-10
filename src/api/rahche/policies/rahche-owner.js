"use strict";

module.exports = async (ctx, config, { strapi }) => {
  const { params } = ctx.request;
  const { rahche: rahcheId } = params;
  const rahche = await strapi
    .service("api::rahche.rahche")
    .findOne(rahcheId, { populate: "*" });

  const { user } = ctx.state;

  if (!rahche) {
    return false;
  }

  ctx.state.rahche = rahche;

  return user.id === rahche.user.id;
};
