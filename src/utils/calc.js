const getYear = require("date-fns-jalali/getYear");

const ageFromJBirthYear = (birthYear) => {
  const year = getYear(new Date());

  return year - birthYear;
};

module.exports = {
  ageFromJBirthYear,
};
