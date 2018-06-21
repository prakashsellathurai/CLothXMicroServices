
var functions = require('firebase-functions')

var sendEmail = require('../../utils/Mail/sendmail')
var OncreateNewStore = functions.firestore
  .document('stores/{storeId}').onCreate((snap, context) => {
    const storeId = context.params.storeId
    const email = snap.data().email
    const ownerName = snap.data().ownerName
    const contactNumber = snap.data().contactNo
    const Password = snap.data().ownerPassword
    const storeName = snap.data().storeName
    sendEmail(email, 'confirmation mail from clothxnet', `hello ${ownerName}`, htmlMessage(storeName, storeId, contactNumber, Password))
  })
function htmlMessage (storeName, storeId, contactNumber, Password) {
  return `<p>your store ${storeName} sid ${storeId} has been registered successfully to clothx net with phone number ${contactNumber} and password ${Password} </p>`
}
module.exports = OncreateNewStore
