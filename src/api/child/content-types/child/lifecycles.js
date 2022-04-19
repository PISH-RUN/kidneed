const deleteRelations = require("../../../../utils/delete-ralations");

const relations = [
  "api::activity.activity",
  "api::notification.notification",
  "api::rahche.rahche",
  "api::child-step.child-step",
  "api::taken-quiz.taken-quiz",
];

module.exports = {
  async afterDelete(event) {
    await deleteRelations(relations, "child");
  },
  async afterDeleteMany(event) {
    await deleteRelations(relations, "child");
  },
};
