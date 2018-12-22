'use strict'

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
setTestEnv()
let admin = require('./../../../functions/shared/environment/initAdmin').setCredentials()
let firestore = admin.firestore()
let productRef = firestore.collection('/products')
firestore.runTransaction(t => {
  return t
    .get(productRef)
    .then((docs) => {
      let promises = []
      docs.forEach(doc => {
        promises.push(doc.data())
      })
      return promises
    }).then((dataArray) => {
      dataArray.forEach(data => {
        for (var key in data) {
          console.log(key, ':', data[key])
        }
      })
    })
})
function convertArrayOfObjectsToCSV (args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data

  data = args.data || null
  if (data == null || !data.length) {
    return null
  }

  columnDelimiter = args.columnDelimiter || ','
  lineDelimiter = args.lineDelimiter || '\n'

  keys = Object.keys(data[0])

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  data.forEach(function (item) {
    ctr = 0
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter

      result += item[key]
      ctr++
    })
    result += lineDelimiter
  })

  return result
}
