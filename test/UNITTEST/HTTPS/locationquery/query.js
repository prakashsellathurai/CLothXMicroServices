const util = require('util')
const exec = require('child_process').exec
async function setTestEnv () {
  try {
    return execPromise('node ./scripts/setDeploymentenv.js clothxtest')
  } catch (e) {
    console.error(e.message)
  }
}
function execPromise (command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }

      resolve(stdout.trim())
    })
  })
}
function getdb () {
  let admin = require('firebase-admin')
  let db = admin.database()
  return db.ref('logs/searches/products').toJSON()
}
setTestEnv().then(() => console.log(getdb()))
