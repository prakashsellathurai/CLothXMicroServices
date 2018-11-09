'use strict'
function functionNameGenerator (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
function MergeAndRemoveDuplicatesArray (array, string) {
  var c = array.concat(string)
  return c.filter(function (item, pos) {
    return c.indexOf(item) === pos
  })
}

module.exports = {
  functionNameGenerator: functionNameGenerator,
  MergeAndRemoveDuplicatesArray: MergeAndRemoveDuplicatesArray
}
