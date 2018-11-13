const db = require('./index')
const firestore = db.firestore

function UserEmailByUUID (uid) {
  return firestore
    .collection('users')
    .where('uid', '==', `${uid}`)
    .get()
    .then(docs => {
      let promises = []
      docs
        .forEach(doc => {
          if (doc.exists) {
            promises.push(doc.data())
          }
        })
      return Promise.all(promises)
    })
    .then(array => array[0])
    .then((doc) => doc.email)
}

module.exports = {
  UserEmailByUUID: UserEmailByUUID
}
