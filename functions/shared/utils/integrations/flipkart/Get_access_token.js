let ERROR_MESSAGE = {
  error: 'key/secret is missing'
}
module.exports = (key, secret) => {
  let FLIPKART_API_BASE_ROOT = 'https://api.flipkart.net/oauth-service'

  var request = require('request-promise')
  if (key == null || secret == null) {
    return Promise.resolve(ERROR_MESSAGE)
  } else {
    return request
      .get({
        url: FLIPKART_API_BASE_ROOT + '/oauth/token',
        headers: {},
        qs: {
          grant_type: 'client_credentials',
          scope: 'Seller_Api',
          'client_id': `${key}`,
          'client_secret': `${secret}`
        }
      })
      .then((res) => res)
      .catch((err) => JSON.parse(JSON.stringify(err)).response.body)
  }
}
