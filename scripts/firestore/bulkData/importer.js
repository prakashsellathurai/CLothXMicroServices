'use strict'
let read = require('./dataHandler')
function setTestEnv () {
  const exec = require('child_process').exec
  exec('node ./scripts/setDeploymentenv.js clothxtest',
    (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`)
      if (error !== null) {
        console.log(`exec error: ${error}`)
      }
    })
}

function GetProductsData () {
  let admin = require('./../../../functions/shared/environment/initAdmin').setCredentials()
  let firestore = admin.firestore()
  let productRef = firestore.collection('/products')
  return firestore.runTransaction(t => {
    return t
      .get(productRef)
      .then((docs) => {
        let promises = []
        docs.forEach(doc => {
          promises.push(doc.data())
        })
        return promises
      })
      // .then((dataArray) => {
      //   dataArray.forEach(data => {
      //     for (var key in data) {
      //       console.log(key, ':', data[key])
      //     }
      //   })
      // })
  })
}

setTestEnv()
GetProductsData()
.then(data => read(data))
