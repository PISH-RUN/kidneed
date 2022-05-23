'use strict';

/**
 * static service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::static.static');
