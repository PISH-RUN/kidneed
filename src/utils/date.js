var getDate = require("date-fns-jalali/getDate");
var getDaysInMonth = require("date-fns-jalali/getDaysInMonth");

const monthRemainingDays = (date) => {
  const dayOfMonth = getDate(date);
  const totalMonthDays = getDaysInMonth(date);

  return totalMonthDays - dayOfMonth + 1;
};

module.exports = {
  monthRemainingDays,
};
