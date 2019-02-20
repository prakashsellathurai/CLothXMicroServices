let productIndex = require('./../../../functions/shared/utils/integrations/algolia/initIndex')
for (var key of productIndex) {
  console.log(key)
}
productIndex
  .getSettings()
  .then(dat => {
    return checkEnv()
      .then((data) => writeFile(productIndex.indexName, dat))
  })
function writeFile (fileName, data) {
  var fs = require('fs')
  var path = require('path')
  fileName = path.join(__dirname, fileName)
  data = JSON.stringify(data)
  return fs.writeFileSync(fileName, data)
}
async function checkEnv () {
  var path = require('path')
  var fs = require('fs')
  let deploymentProjectConfig = await JSON.parse(fs.readFileSync(path.join(__dirname, './../../../functions/shared/environment/.deployenv'), 'utf8'))
  return deploymentProjectConfig
}
function traverse (x, level) {
  if (isArray(x)) {
    traverseArray(x, level)
  } else if ((typeof x === 'object') && (x !== null)) {
    traverseObject(x, level)
  } else {
    console.log(level + x)
  }
}

function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

function traverseArray (arr, level) {
  console.log(level + '<array>')
  arr.forEach(function (x) {
    traverse(x, level + '  ')
  })
}

function traverseObject (obj, level) {
  console.log(level + '<object>')
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      console.log(level + '  ' + key + ':')
      traverse(obj[key], level + '    ')
    }
  }
}
