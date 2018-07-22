// ##################################################################
var admin = require('firebase-admin')
var gcloud = require('@google-cloud/storage')({
  projectId: 'clothxnet',
  keyFilename: './../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json'
})
var serviceAccount = require('./../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'
})
var db = require('../../../../functions/firestore/CRUD/db')
let storelog = {
  email: 'prakash1729brt@gmail.com',
  storename: 'shifu',
  proprietorname: 'ehfbeu',
  address: 'address ',
  ownername: 'kash',
  numberofbranches: 25,
  noofworkers: 54,
  noofusers: 5,
  panno: 54585421414111,
  images: ['1_9gSuypCiTrSwMCy18OJdyg (1).png', '1_9gSuypCiTrSwMCy18OJdyg (1).png', '1_9gSuypCiTrSwMCy18OJdyg (1).png', '1_9gSuypCiTrSwMCy18OJdyg (1).png', '1_9gSuypCiTrSwMCy18OJdyg (1).png'],
  logo: ['1_9gSuypCiTrSwMCy18OJdyg (1).png'],
  contactno: 9843158807,
  accuracy: 588,
  geopoint: { Latitude: 54, Longitude: 54 },
  monthlyrevenue: undefined,
  storetype: 'retailer'

}
db.createStoreByStoreLog(storelog).then(ref => {
  console.log(ref)
})
