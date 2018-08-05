var admin = require('firebase-admin')
var CONTANTS = require('../../../../functions/environment/CONSTANTS')
var serviceAccount = require('./../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'
})
var storage = admin.storage().bucket(CONTANTS.STORAGE_BUCKET)
function HandleFilemove (uuid, sid, imagelocationArr, logolocationarr) {
  let promises = []
  for (let index = 0; index < logolocationarr.length; index++) {
    promises.push(storage.file(`/DbIndex/stores/addstorelog/${uuid}/${logolocationarr[index]}`).move(`stores/${sid}/${logolocationarr[index]}`))
  }
  for (let index = 0; index < imagelocationArr.length; index++) {
    promises.push(storage.file(`/DbIndex/stores/addstorelog/${uuid}/${imagelocationArr[index]}`).move(`stores/${sid}/${imagelocationArr[index]}`))
  }
  return Promise.all(promises)
}
function CloudMove (oldlocation, newlocation) {
return storage.file(oldlocation).move(newlocation)
}
CloudMove('/logs/addstore/aax4wj9B_700w_0.jpg','a.jpg').then((ref) =>{
  console.log()
}).catch(err => {
  throw err
})