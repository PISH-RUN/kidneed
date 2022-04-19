async function removeRelations(models, relation) {
  await models.reduce(async (acc, model) => {
    await acc;
    return remove(model, relation);
  }, Promise.resolve());
}

async function remove(model, relation) {
  const records = await strapi.query(model).findMany({
    where: { [relation]: { id: { $null: true } } },
    select: ["id"],
  });

  const ids = records.map((r) => r.id);

  await strapi.query(model).deleteMany({ where: { id: { $in: ids } } });
}

module.exports = removeRelations;
