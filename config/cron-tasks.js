module.exports = {
  "0 6 * * *": require("../src/cron/quiz-reminder"),
  "*/5 * * * *": require("../src/cron/subscription"),
};
