const { object, string, number, mixed } = require("yup");

module.exports = async (strapi) => {
  const allowedAges = (
    await strapi
      .query("api::age-group.age-group")
      .findMany({ select: ["slug"] })
  ).map((age) => age.slug);

  const allowedTypes = await strapi.service("api::quiz.extended").typeEnums();

  const allowedGrowthSubfields = (
    await strapi
      .query("api::growth-subfield.growth-subfield")
      .findMany({ select: ["name"] })
  ).map((g) => g.name);

  const baseSchema = object({
    question: string().required(),
    subfield: mixed().oneOf(allowedGrowthSubfields).required(),
  });

  return (index) => {
    if (index !== 0) {
      return baseSchema;
    }

    return baseSchema.concat(
      object({
        name: string().required(),
        age: mixed().oneOf(allowedAges).required(),
        type: mixed().oneOf(allowedTypes).nullable(),
      })
    );
  };
};
