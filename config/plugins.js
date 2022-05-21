const crypto = require("crypto");

module.exports = {
  "users-permissions": {
    config: {
      jwtSecret: crypto.randomBytes(16).toString("base64"),
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
};
