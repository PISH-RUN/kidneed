module.exports = async ({ strapi }) => {
  const now = new Date();
  const subscribed = await strapi
    .service("plugin::users-permissions.extended")
    .subscribedRole();

  const authenticated = await strapi
    .service("plugin::users-permissions.extended")
    .authenticatedRole();

  const users = await strapi.query("plugin::users-permissions.user").findMany({
    where: {
      $and: [{ subscribedUntil: { $lte: now } }, { role: subscribed.id }],
    },
  });

  await users.reduce(async (acc, user) => {
    await acc;
    return updateUser(user);
  }, Promise.resolve());

  async function updateUser(user) {
    await strapi.service("plugin::users-permissions.user").edit(user.id, {
      role: authenticated.id,
    });
  }
};
