let ERROR_MESSAGE = {
  error: 'unauthorized',
  error_description: 'query params not given'
}
const apiRequest = require('./Api_request')
module.exports = (key, secret) => {
  if (key == null || secret == null) {
    return Promise.resolve(ERROR_MESSAGE)
  } else {
    return apiRequest.GetAccessToken(key, secret)
      .then((res) => JSON.parse(JSON.stringify(res)))
      .catch((err) => JSON.parse(JSON.stringify(err)).response.body)
  }
}
