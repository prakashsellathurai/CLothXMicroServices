'use strict'
const request = require('request-promise')
const env = require('./../../../environment/env')
const FLIPKART_API_BASE_ROOT = env.OMNI_CHANNEL_INTEGRATION.FLIKART.AUTH_API_URL
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8'
}
const post = (url, body) => {
  return request
    .post({url: url,
      headers: DEFAULT_HEADERS,
      body: body
    })
}
const get = (url, body) => {
  return request
    .get({
      url: url,
      headers: DEFAULT_HEADERS,
      body: body
    })
}
const GetAccessToken = (key, secret) => {
  return request
    .get({
      url: FLIPKART_API_BASE_ROOT,
      headers: DEFAULT_HEADERS,
      qs: {
        grant_type: 'client_credentials',
        scope: 'Seller_Api',
        'client_id': `${key}`,
        'client_secret': `${secret}`
      }
    })
}
module.exports = {
  post: post,
  get: get,
  GetAccessToken: GetAccessToken
}
