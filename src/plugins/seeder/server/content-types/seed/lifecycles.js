const seeding = require("../../seeding");

module.exports = {
  async afterDelete(event) {
    await seeding({ strapi });
  },
  async afterDeleteMany(event) {
    await seeding({ strapi });
  },
};
