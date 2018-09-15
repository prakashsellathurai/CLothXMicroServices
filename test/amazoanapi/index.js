'use strict'
const CONSTANTS = require('../../functions/shared/environment/CONSTANTS')
const ACCESS_KEY_ID = CONSTANTS.CREDENTIALS_FOR_TESTING.AWS_ACCESS_KEY_ID
const ACCESS_SECRET_KEY = CONSTANTS.CREDENTIALS_FOR_TESTING.AWS_SECRET_ACCESS_KEY
var amazonMWS = require('amazon-mws')(ACCESS_KEY_ID, ACCESS_SECRET_KEY)

amazonMWS.feeds.search({
  'Version': '2009-01-01',
  'Action': 'GetFeedSubmissionList',
  'SellerId':ACCESS_KEY_ID,
  'MWSAuthToken': ACCESS_SECRET_KEY
}, function (error, response) {
  if (error) {
    console.log('error ', error)
    return
  }
  console.log('response', response)
})
