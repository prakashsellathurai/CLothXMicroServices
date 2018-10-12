let ERROR_MESSAGE = {
  error: 'key/secret is missing'
}

describe('Oauth2', function () {
  let assert = require('assert')
  it('gets bearer token', function (done) {
    FlipkartGetAccessToken('b7b0811327b2975262318ab844bb8a836050', '1bd70ec15c0d3b31879e86d532db6fe7a')
      .then((body) => {
        if (typeof JSON.parse(body) === 'object') {
          console.log(body)
          done()
        } else {
          done('not json')
        }
      })
      .catch((err) => done(err))
  })
  it('it should return error message on undefuned value', function (done) {
    FlipkartGetAccessToken(undefined, undefined)
      .then(body => {
        console.log(body)
        let assert = require('assert')
        assert.deepStrictEqual(body, ERROR_MESSAGE)
        done()
      })
  })
  it('should return error on wrong info', function (done) {
    FlipkartGetAccessToken('a', 'm')
      .then(body => {
        console.log(body)
        if (typeof JSON.parse(body) === 'object') {
          done()
        } else {
          done('not json')
        }
      })
  })
})

function FlipkartGetAccessToken (key, secret) {
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
      .then((res) =>  JSON.parse(JSON.stringify(res)))
      .catch((err) => JSON.parse(JSON.stringify(err)).response.body)
  }
}
