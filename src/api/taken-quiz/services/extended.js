module.exports = ({ strapi }) => ({
  async current(childId, quizId, type) {
    const step = await strapi.service("api::step.extended").current();
    const populate = ["answers"];

    const takenQuiz = await strapi.query("api::taken-quiz.taken-quiz").findOne({
      where: { step: step.id, child: childId, type },
      populate,
    });

    if (takenQuiz) {
      return takenQuiz;
    }

    return await strapi
      .service("api::taken-quiz.taken-quiz")
      .create(
        { data: { child: childId, quiz: quizId, type, step: step.id } },
        { populate }
      );
  },

  async typesEnum() {
    const takenQuiz = await strapi.getModel("api::taken-quiz.taken-quiz");

    return takenQuiz.attributes.type.enum;
  },
});
