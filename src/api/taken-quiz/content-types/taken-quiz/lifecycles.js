const deleteRelations = require("../../../../utils/delete-ralations");

const relations = ["api::answer.answer"];

module.exports = {
  async afterDelete() {
    await deleteRelations(relations, "takenQuiz");
  },
  async afterDeleteMany() {
    await deleteRelations(relations, "takenQuiz");
  },
};
