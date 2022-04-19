var getYear = require("date-fns-jalali/getYear");

const durations = {
  audio: 15,
  book: 20,
  game: 20,
  activity: 30,
  video: {
    3: 60,
    8: 120,
  },
};

async function updateDuration(record, model) {
  const { id, type } = record;
  let duration = durations[type];

  if (!duration) {
    return;
  }

  if (typeof duration === "object") {
    let child = record.child;

    if (!child) {
      child = (
        await strapi
          .query("api::activity.activity")
          .findOne({ where: { id }, populate: ["child"] })
      ).child;
    }

    if (!child) {
      return;
    }

    const age = getYear(new Date()) - child.birthYear;
    const ageGroup = await strapi.service("api::age-group.extended").get(child);

    duration = duration[ageGroup.slug];

    if (!duration) {
      return;
    }
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
