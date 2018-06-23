
var functions = require('firebase-functions')
var dbFun = require('../CRUD/db')
var sendEmail = require('../../utils/Mail/sendmail')
var sendMessage = require('../../utils/message/SendMessage')
var OncreateNewStore = functions.firestore
  .document('stores/{storeId}').onCreate((snap, context) => {
    const storeId = context.params.storeId
    const email = snap.data().email
    const ownerName = snap.data().ownerName
    const contactNumber = snap.data().contactNo
    const Password = snap.data().ownerPassword
    let ownerphoneNumber
    const storeName = snap.data().storeName

    return dbFun.GetOwner(storeId).then(doc => {
      return doc.docs.forEach(doc => {
        ownerphoneNumber = doc.id
        return dbFun.encryptThePasswordOnCreate(storeId, ownerphoneNumber, Password).then(() => { // encrypt the password sha 256
          sendEmail(email, 'confirmation mail from clothxnet', `hello ${ownerName}`, htmlMessage(storeName, storeId, ownerphoneNumber, Password))
          sendMessage(ownerphoneNumber, `your store ${storeName} /storeId ${storeId} has been registered successfully to clothx net with phone number ${contactNumber} and password ${Password}`)
        })
      })
    })
  })
function htmlMessage (storeName, storeId, contactNumber, Password) {
  return `<p>your store ${storeName} /storeId ${storeId} has been registered successfully to clothx net with phone number ${contactNumber} and password ${Password} </p>`
}
module.exports = OncreateNewStore
