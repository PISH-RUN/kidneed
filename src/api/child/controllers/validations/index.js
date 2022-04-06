"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");
const parse = require("date-fns/parse");
const isDate = require("date-fns/isDate");

const selectFieldValidation = (allowed) =>
  yup.object().shape({
    field: yup.mixed().oneOf(allowed).required(),
  });

const createActivityValidation = yup.object().shape({
  // date: yup
  //   .date()
  //   .transform((_, originalValue) => {
  //     return isDate(originalValue)
  //       ? originalValue
  //       : parse(originalValue, "yyyy-MM-dd", new Date());
  //   })
  //   .min(new Date())
  //   .required(),
  content1: yup.number().integer().positive().required(),
  content2: yup.number().integer().positive().required(),
});

module.exports = {
  validateFieldSelection: (allowed) =>
    validateYupSchema(selectFieldValidation(allowed)),
  validateCreateActivity: validateYupSchema(createActivityValidation),
};
