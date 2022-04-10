const { object, string, number, mixed } = require("yup");

module.exports = object({
  min: number().positive().integer().required(),
  max: number().positive().integer().required(),
  slug: string().required(),
  description: string().nullable(),
});
