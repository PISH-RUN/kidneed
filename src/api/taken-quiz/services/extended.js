module.exports = ({ strapi }) => ({
  async current(childId, quizId, type) {
    const step = await strapi.service("api::step.extended").current();

    const takenQuiz = await strapi.query("api::taken-quiz.taken-quiz").findOne({
      where: { step: step.id, child: childId, type },
      populate: ["quiz", "questions"],
    });

    if (takenQuiz) {
      return takenQuiz;
    }

    return await strapi
      .service("api::taken-quiz.taken-quiz")
      .create(
        { data: { child: childId, quiz: quizId, type, step: step.id } },
        { populate: ["quiz"] }
      );
  },
});
