
/** Express router providing listings related routes
 * @module api/v0/listings
 * @requires express
 */

/**
 * express module
 * @const
 */
const express = require('express')
/**
 * Express router to mount listings related functions on.
 * @type {object}
 * @const
 * @namespace listingsRouter
 */
const listingsRouter = express.Router()
/**
 * Route serving api registering service portal
 * @name  get:api/v0/listings/register
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.get('/register', (req, res) => {

})
/**
 * Route serving api registering post service
 * @name  post:api/v0/listings/register
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('register', (req, res) => {

})
/**
 * Route serving listings create service
 * @name  post:api/v0/listings/create
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('/create', (req, res) => {

})
/**
 * Route serving listings update service
 * @name  post:api/v0/listings/update/:listId
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('/update/:listId', (req, res) => {

})
/**
 * Route serving listings delete service
 * @name  post:api/v0/listings/delete/lisId
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('/delete/:listId', (req, res) => {

})
/**
 * Route serving list get request
 * @name  get:api/v0/listings/:listId
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.get('/:listId', (req, res) => {

})
/**
 * Route to delete al created listing
 * @name post:api/v0/listings/delete/all
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('delete/all', (req, res) => {

})
/**
 * Route to generate listings from uploaded products
 * @name post:api/v0/listings/generate
 * @function
 * @memberof module:api/v0/listings
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
listingsRouter.post('/generate', (req, res) => {

})

module.exports = listingsRouter
