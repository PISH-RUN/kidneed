"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const progressValidation = yup.object().shape({
  progress: yup.number().positive().integer().required(),
});

module.exports = {
  validateProgressBody: validateYupSchema(progressValidation),
};
