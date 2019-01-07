var Promise = require('bluebird')
const exec = require('child_process').exec
const _ = require('lodash')
async function setTestEnv () {
  try {
    return execPromise('node ./scripts/setDeploymentenv.js clothxtest')
  } catch (e) {
    console.error(e.message)
  }
}
function execPromise (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return resolve(false)
      if (stderr) return resolve(false)
      resolve(true)
    })
  })
}
async function getdb () {
  let admin = require('./../../../../functions/shared/environment/initAdmin').setCredentials()
  let db = admin.database()
  let values = await db
    .ref('logs/searches/products')
    .orderByChild('timestamp')
    .once('value')
    .then((data) => _.values(data.val()))
  return values
}
function checkIFInside (coordinates) {
  var geolib = require('geolib')
  return geolib.isPointInCircle(
    { latitude: 10.9416207, longitude: 76.9583311 },
    coordinates,
    200
  )
}
setTestEnv().then((val) => {
  if (val) {
    return getdb()
      .then(logs => {
        for (const log of logs) {
          let location = log.body.location
          if (typeof location !== 'undefined') {
            if (checkIFInside({
              latitude: location.latlong._lat,
              longitude: location.latlong._long
            })) {
              console.log('true')
            }
            console.log(location)
          }
        }
      })
  }
})
