'use strict'
let initAdmin = require('./../../../functions/shared/environment/initAdmin')
let firestore
try {
  let admin = initAdmin.setCredentials()
  firestore = admin.firestore()
} catch (e) {
  console.error(e)
}

firestore.collection('products').get().then((docs) => {
  return docs.forEach(doc => {
    console.log(doc.id)
  })
})
