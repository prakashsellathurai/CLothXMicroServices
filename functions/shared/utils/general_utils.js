'use strict'
function functionNameGenerator (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
async function checkEnv () {
  var path = require('path')
  var fs = require('fs')
  let deploymentProjectConfig = await JSON.parse(fs.readFileSync(path.join(__dirname, './../environment/.deployenv'), 'utf8'))
  return deploymentProjectConfig.production
}

module.exports = {
  functionNameGenerator: functionNameGenerator,
  checkEnv: checkEnv
}
