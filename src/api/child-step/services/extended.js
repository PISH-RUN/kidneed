module.exports = ({ strapi }) => ({
  async current(childId) {
    const step = await strapi.service("api::step.extended").current();
    const populate = ["growthField", "child"];

    let childStep = await strapi.query("api::child-step.child-step").findOne({
      where: { step: step.id, child: childId },
      populate,
    });

    if (!childStep) {
      childStep = await strapi
        .service("api::child-step.child-step")
        .create({ data: { step: step.id, child: childId } }, { populate });
    }

    return childStep;
  },
  async selectField(childId, field) {
    const childStep = await this.current(childId);

    return await strapi
      .service("api::child-step.child-step")
      .update(childStep.id, { data: { field } });
  },

  async generated(childStep) {
    return await strapi
      .service("api::child-step.child-step")
      .update(childStep.id, { data: { planGenerated: true } });
  },
});
