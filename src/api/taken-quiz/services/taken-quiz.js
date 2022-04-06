'use strict';

/**
 * taken-quiz service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::taken-quiz.taken-quiz');
