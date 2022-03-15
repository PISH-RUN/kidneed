module.exports = ({ strapi }) => ({
  async exists(stepId, childId) {
    const didGenerated = await strapi
      .query("api::child-step.child-step")
      .count({ where: { step: stepId, child: childId } });

    return didGenerated > 0;
  },
  async currentStepExists(childId) {
    const step = await strapi.service("api::step.extended").current();

    return this.exists(step.id, childId);
  },
  async generate(stepId, childId) {
    const childStep = await strapi
      .query("api::child-step.child-step")
      .create({ data: { step: stepId, child: childId } });

    return childStep;
  },
});
