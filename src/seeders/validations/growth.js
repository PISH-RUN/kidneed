const { object, string, number, mixed } = require("yup");

module.exports = (allowed) =>
  object({
    field: string().required(),
    subfield: string().required(),
    symbol: mixed().oneOf(allowed).required(),
    number: number().positive().min(1).max(4),
  });
