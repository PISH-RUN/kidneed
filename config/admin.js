const crypto = require("crypto");

module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "3876d1c8e8c5cb3511f09ebb388c1bd3"),
  },
  apiToken: { salt: crypto.randomBytes(16).toString("base64") },
});
