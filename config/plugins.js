module.exports = ({ env }) => ({
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
  sms: {
    enabled: true,
    resolve: "./src/plugins/sms",
    config: {
      provider: "ghasedak",
      providersOptions: {
        ghasedak: {
          apiKey: env("GHASEDAK_API_KEY"),
        },
      },
    },
  },
});
