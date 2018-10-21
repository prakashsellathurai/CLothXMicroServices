'use strict'
const URL = require('./URL_generator').createListing()
const API_REQUEST = require('./Api_request')
// const determinant = require('./determinant')
// const STATUS_OK = determinant.VALIDITY_STATUS_OK
module.exports = (PostedListingObj) => {
  return API_REQUEST.post(URL, PostedListingObj)
    .then((response) => JSON.parse(response))
}
