const env = require('./env')
const algoliasearch = require('algoliasearch')
var path = require('path')
var fs = require('fs')
function withCredentials () {
  try {
    let deploymentProjectConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '/.deployenv'), 'utf8'))
    let keyConfig = (deploymentProjectConfig.production) ? env.ALGOLIA.prod : env.ALGOLIA.test
    return algoliasearch(keyConfig.appId, keyConfig.adminApiKey)
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  withCredentials: withCredentials
}
