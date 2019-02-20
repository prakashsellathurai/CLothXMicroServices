let productIndex = require('./../../../functions/shared/utils/integrations/algolia/initIndex')
for (var key,)
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
