module.exports = {
  seeder: {
    enabled: true,
    resolve: "./src/plugins/seeder",
    config: {
      seeders: {
        growth: require("../src/seeders/growth"),
        quiz: require("../src/seeders/quiz"),
      },
    },
  },
};
