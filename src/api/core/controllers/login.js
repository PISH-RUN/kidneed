"use strict";

const utils = require("@strapi/utils");
const differenceInMinutes = require("date-fns/differenceInMinutes");
const addMinutes = require("date-fns/addMinutes");
const parseISO = require("date-fns/parseISO");

const { validateCreateUserBody } = require("./validations");
const { getService, smsService } = require("../utils");
const sanitizeUser = require("../utils/sanitize-user");
const token = require("../utils/token");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const tokenExpiryMinutes = 15;
const tokenRequestPeriod = 0;

const updateUser = async (id, data) => await getService("user").edit(id, data);

const sendOtp = async (user) => {
  const now = new Date();
  if (
    user.otpSentAt &&
    differenceInMinutes(now, parseISO(user.otpSentAt)) < tokenRequestPeriod
  ) {
    return;
  }

  let otp = token().toString();
  if (
    user.otp &&
    user.otpExpiresAt &&
    differenceInMinutes(now, parseISO(user.otpExpiresAt)) < tokenExpiryMinutes
  ) {
    otp = user.otp;
  }

  await updateUser(user.id, {
    otp,
    otpSentAt: now,
    otpExpiresAt: addMinutes(now, 15),
  });

  await smsService().otp(user.mobile, otp);
};

const createUser = async (mobile) => {
  const advanced = await strapi
    .store({ type: "plugin", name: "users-permissions", key: "advanced" })
    .get();

  const defaultRole = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: advanced.default_role } });

  try {
    return await getService("user").add({ mobile, role: defaultRole });
  } catch (error) {
    throw new ApplicationError(error.message);
  }
};

module.exports = {
  async requestOTP(ctx) {
    await validateCreateUserBody(ctx.request.body);

    const { mobile } = ctx.request.body;

    let user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { mobile } });

    if (!user) {
      user = await createUser(mobile);
    }

    await sendOtp(user);

    return {
      ok: true,
    };
  },

  async login(ctx) {
    const params = ctx.request.body;

    const query = {
      mobile: params.mobile,
      otp: params.token,
    };

    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: query });

    if (!user) {
      throw new ValidationError("Invalid Credentials");
    }

    if (user.fixedLogin) {
      return ctx.send({
        jwt: getService("jwt").issue({
          id: user.id,
        }),
        user: await sanitizeUser(user, ctx),
      });
    }

    if (
      differenceInMinutes(new Date(), parseISO(user.otpExpiresAt)) >
      tokenExpiryMinutes
    ) {
      throw new ValidationError("Invalid Credentials");
    }

    await updateUser(user.id, {
      otp: null,
      otpSentAt: null,
      otpExpiresAt: null,
    });

    ctx.send({
      jwt: getService("jwt").issue({
        id: user.id,
      }),
      user: await sanitizeUser(user, ctx),
    });
  },
};
