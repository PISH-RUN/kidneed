const crypto = require("crypto");

module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      jwtSecret:
        env("NODE_ENV") === "production"
          ? crypto.randomBytes(16).toString("base64")
          : "dE0Sw1ilxukNMdsN",
    },
  },
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
});
