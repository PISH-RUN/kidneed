"use strict";

module.exports = {
  async callback(ctx) {
    const { query } = ctx.request;
    const { Authority, Status } = query;

    const failedRedirect = strapi.config.get(
      "payment.failed",
      "https://yekodo.ir"
    );

    const successRedirect = strapi.config.get(
      "payment.success",
      "https://yekodo.ir"
    );

    if (Status === "OK") {
      try {
        const purchase = await strapi
          .service("api::payment.zarinpal")
          .verify(Authority);

        return ctx.redirect(successRedirect + `?purchase=${purchase.uuid}`);
      } catch (e) {
        console.log(e);
        console.error(e.message);
      }
    }

    return ctx.redirect(failedRedirect);
  },
};
