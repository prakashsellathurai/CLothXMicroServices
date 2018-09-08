var CONTANTS = require('../../../environment/CONSTANTS')
var admin = require('firebase-admin')
var storage = admin.storage().bucket(CONTANTS.STORAGE_BUCKET)
function HandleFilemove (uuid, sid, imagelocationArr, logolocationarr) {
  let promises = []
  console.log(imagelocationArr, logolocationarr)
  for (const iterator of logolocationarr) {
    console.log(iterator)
    promises.push(storage.file(`/logs/addstore/${uuid}/logo/${iterator}`).move(`stores/${sid}/logo/${iterator}`))
  }

  for (const iterator of imagelocationArr) {
    console.log(iterator)
    promises.push(storage.file(`/logs/addstore/${uuid}/images/${iterator}`).move(`stores/${sid}/images/${iterator}`))
  }
  return Promise.all(promises)
}
module.exports = {
  HandleFileMove: HandleFilemove
}
