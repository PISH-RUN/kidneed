"use strict";

const flatten = require("lodash/flatten");

const rService = () => strapi.service("api::rahche.rahche");
const rConnQuery = () =>
  strapi.query("api::rahche-connection.rahche-connection");
const rQuestionQuery = () =>
  strapi.query("api::rahche-question.rahche-question");
const rRootQuery = () => strapi.query("api::rahche-root.rahche-root");

const intersection = require("lodash/intersection");

module.exports = {
  async find(ctx) {
    const { rahche } = ctx.state;

    const connections = await rConnQuery().findMany({
      where: {
        subject: rahche.subject.id,
        sign: { id: { $in: rahche.signs.map((s) => s.id) } },
      },
      populate: ["root", "root.questions"],
    });

    const questions = flatten(connections.map((c) => c.root.questions));

    return { data: questions };
  },
  async select(ctx) {
    const { rahche } = ctx.state;
    const { body } = ctx.request;

    const { selected } = body.data;

    const existsQuestions = await rQuestionQuery().count({
      where: { id: { $in: selected } },
    });

    if (existsQuestions < selected.length) {
      return ctx.badRequest(`Ilegal question id`);
    }

    const roots = await rRootQuery().findMany({
      where: { questions: { id: { $in: selected } } },
      populate: ["questions"],
    });

    const selectedRoots = roots.filter(
      (r) =>
        intersection(
          r.questions.map((q) => q.id),
          selected
        ).length >
        r.questions.length / 2
    );

    await rService().update(rahche.id, { data: { roots: selectedRoots } });

    return { ok: true };
  },
};
