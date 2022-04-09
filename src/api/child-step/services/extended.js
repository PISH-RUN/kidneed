module.exports = ({ strapi }) => ({
  async current(childId, populate) {
    const step = await strapi.service("api::step.extended").current();

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

  async growthField(childId) {
    const childStep = await this.current(childId, ["growthField"]);

    return childStep.growthField;
  },

  async selectField(childId, growthField) {
    const childStep = await this.current(childId, ["growthField"]);

    if (childStep.growthField) {
      throw new Error(
        `You currently selected growth field for this month, selected: ${childStep.growthField.name}`
      );
    }

    return await strapi
      .service("api::child-step.child-step")
      .update(childStep.id, { data: { growthField } });
  },

  async generated(childStep) {
    return await strapi
      .service("api::child-step.child-step")
      .update(childStep.id, { data: { planGenerated: true } });
  },
});
