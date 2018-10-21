let ERROR_MESSAGE = {
  error: 'unauthorized error',
  error_description: 'query params not given'
}
const env = require('./../../../environment/env')
let FLIPKART_API_BASE_ROOT = env.OMNI_CHANNEL_INTEGRATION.FLIKART.AUTH_API_URL
module.exports = (key, secret) => {
  var request = require('request-promise')
  if (key == null || secret == null) {
    return Promise.resolve(ERROR_MESSAGE)
  } else {
    return request
      .get({
        url: FLIPKART_API_BASE_ROOT,
        headers: {},
        qs: {
          grant_type: 'client_credentials',
          scope: 'Seller_Api',
          'client_id': `${key}`,
          'client_secret': `${secret}`
        }
      })
      .then((res) => JSON.parse(JSON.stringify(res)))
      .catch((err) => JSON.parse(JSON.stringify(err)).response.body)
  }
}
