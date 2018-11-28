'use strict'
const URL = require('./URL_generator').updateinventoryListing()
const API_REQUEST = require('./Api_request')
const db = require('./../../../firestore/CRUD/index')
// const determinant = require('./determinant')
// const STATUS_OK = determinant.VALIDITY_STATUS_OK
module.exports = (Authkey, storeId, PostedListingObj) => {
  return API_REQUEST.post(URL, Authkey, PostedListingObj)
    .then((response) => {
      return db.utils.flipkart.log.onInventoryUpdate(storeId, response)
        .then((response) => JSON.parse(response))
    })
}
