const durations = {
  audio: 15,
  book: 20,
  game: 20,
};

async function updateDuration(record, model) {
  const { id, type } = record;
  const duration = durations[type];

  if (!duration) {
    return;
  }

  await strapi.service(model.uid).update(id, { data: { duration } });
}

module.exports = {
  async afterCreate(event) {
    const { result, model } = event;

    await updateDuration(result, model);
  },
  async afterCreateMany(event) {
    const { result, model } = event;

    await result.reduce(async (acc, record) => {
      await acc;
      return updateDuration(record, model);
    }, Promise.resolve());
  },
};
