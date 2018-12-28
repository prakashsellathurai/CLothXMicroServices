const env = require('./env')
var cloudinary = require('cloudinary')
var path = require('path')
var fs = require('fs')
function withCredentials () {
  try {
    let deploymentProjectConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '/.deployenv'), 'utf8'))
    let keyConfig = (deploymentProjectConfig.production) ? env.CLOUDINARY.prod : env.CLOUDINARY.test
    cloudinary.config(keyConfig)
    return cloudinary
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  withCredentials: withCredentials
}
