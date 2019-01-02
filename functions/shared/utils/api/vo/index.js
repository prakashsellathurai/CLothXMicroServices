/** Express router providing v0 related routes
 * @module api/v0
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
/**
 * Express router to mount v0 related functions on.
 * @type {object}
 * @const
 * @namespace v0Router
 */
const v0Router = express.Router()
/**
 * listingsRouter Module
 * @module listings/index
 * @see module:api/v0/listings
 */
const listingsRouter = require('./listings/index')
/**
 * route to redirect to listings router
 * @name  get:api/v0/listings
 * @function
 * @memberof module:api/v0
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
v0Router.use('/listings', listingsRouter)

module.exports = v0Router
