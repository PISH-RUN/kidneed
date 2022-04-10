module.exports = {
  seeder: {
    enabled: true,
    resolve: "./src/plugins/seeder",
    config: {
      seeders: {
        age: require("../src/seeders/age"),
        growth: require("../src/seeders/growth"),
        quiz: require("../src/seeders/quiz"),
      },
    },
  },
};
