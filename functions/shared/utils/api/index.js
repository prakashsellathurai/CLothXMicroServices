'use strict'
/** Express router providing api related routes
 * @module api
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
/**
 * Express router to mount api related functions on.
 * @type {object}
 * @const
 * @namespace apiRouter
 */
const apiRouter = express.Router()
/**
 * v0Router Module
 * @module v0/index
 * @see module:api/v0
 */
const v0Router = require('./vo/index')
/**
 * route to redirect to v0
 * @name  get:api/v0
 * @function
 * @memberof module:api/v0
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
apiRouter.use('/v0', v0Router)

module.exports = apiRouter
