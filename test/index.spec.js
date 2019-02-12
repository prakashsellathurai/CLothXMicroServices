const glob = require('glob')
const path = require('path')
const utils = require('./../functions/shared/utils/general_utils')
let ABSOLUTE_PATH = path.join(__dirname, '/')
glob
  .sync('{,!(node_modules)/**/}*.spec.js',
    { cwd: ABSOLUTE_PATH })
  .forEach(FILE => {
    if (FILE !== 'index.spec.js') {
      var name = utils.functionNameGenerator(FILE)
      exports[name] = require('./' + FILE)
    }
  })
