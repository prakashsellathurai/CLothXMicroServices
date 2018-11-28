'use strict'
function functionNameGenerator (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
module.exports = {
  functionNameGenerator: functionNameGenerator
}
