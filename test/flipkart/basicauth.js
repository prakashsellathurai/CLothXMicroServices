describe('Oauth2', function () {
  it('gets bearer token', function (done) {
    GetOauthTokenForFlipkart('64466191ab01796640446b2083a85974649b', '21d754c859f3b99ece17b7d72b09b5eb')
      .then(() => done())
      .catch((err) => done(err))
  })
})
function GetOauthTokenForFlipkart (key, secret) {
  var OAuth = require('oauth')
  var OAUTH2 = OAuth.OAuth2
  var oauth2 = new OAUTH2(key, secret, 'https://api.flipkart.net', null, '/oauth-service/oauth/token', null)
  return Promise.resolve(oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
  }, function (e, access_token, refersh_token, results) {
    console.log(access_token)
    console.log(refersh_token)
    console.log('bearer: ', results)
    if (access_token == null) {
      Promise.reject('eror')
    } else {
      return results
    }
  }))
}
