var CONTANTS = require('../../../environment/CONSTANTS')
var admin = require('firebase-admin')
var storage = admin.storage().bucket(CONTANTS.STORAGE_BUCKET)
function HandleFilemove (uuid, sid, imagelocationArr, logolocationarr) {
  let promises = []
  for (let index = 0; index < logolocationarr.length; index++) {
    promises.push(storage.file(`/DbIndex/stores/addstorelog/${uuid}/logo/${logolocationarr[index]}`).move(`stores/${sid}/logo/${logolocationarr[index]}`))
  }
  for (let index = 0; index < imagelocationArr.length; index++) {
    promises.push(storage.file(`/DbIndex/stores/addstorelog/${uuid}/images/${imagelocationArr[index]}`).move(`stores/${sid}/images/${imagelocationArr[index]}`))
  }
  return Promise.all(promises)
}
module.exports = {
  HandleFileMove: HandleFilemove
}
