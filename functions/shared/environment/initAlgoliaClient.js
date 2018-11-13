const env = require('./env')
const algoliasearch = require('algoliasearch')
function withCredentials () {
  try {
    return algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  withCredentials: withCredentials
}
