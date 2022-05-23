'use strict';

/**
 *  static controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::static.static');
