'use strict'
function functionNameGenerator (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
function generateId () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 10; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
module.exports = {
  functionNameGenerator: functionNameGenerator,
  generateId: generateId
}
