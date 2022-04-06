"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const selectFieldValidation = (allowed) =>
  yup.object().shape({
    field: yup.mixed().oneOf(allowed).required(),
  });

module.exports = {
  validateFieldSelection: (allowed) =>
    validateYupSchema(selectFieldValidation(allowed)),
};
