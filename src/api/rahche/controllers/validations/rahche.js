const { yup, validateYupSchema } = require("@strapi/utils");

const selectSubjectValidation = yup.object().shape({
  subject: yup.number().positive().integer().required(),
  child: yup.number().positive().integer().required(),
});

module.exports = {
  validateSelectSubject: validateYupSchema(selectSubjectValidation),
};
