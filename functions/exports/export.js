const glob = require('glob')
function exportFunction () {
  return glob.sync('{,!(node_modules)/**/}*.js', { cwd: __dirname }).forEach(file => {
    const only = process.env.FUNCTION_NAME
    const name = concoctFunctionName(file)
    if (only === undefined || only === name) {
      console.log(name + '' + 'file: ' + file)
    }
  })
}

function concoctFunctionName (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
exportFunction()
