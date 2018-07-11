var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var SHA256 = require('../../functions/node_modules/crypto-js/sha256')
var firestore = admin.firestore()
function GetOwner (sid) {
  return firestore.collection(`stores/${sid}/employees/`).where('role', '==', 'owner').get().then(doc => {
    console.log(doc)
  })
}
var sendEmail = require('../../functions/utils/Mail/sendmail')
var sendMessage = require('../../functions/utils/message/SendMessage')
function OncreateEmployee (storeId, ownerphoneNumber, Password, email) {
  return GetOwner(storeId).then(doc => {
    console.log(doc)
    return doc.docs.forEach(doc => {
      ownerphoneNumber = doc.id
      console.log(doc.id)
      return encryptThepasswordOnce(storeId, ownerphoneNumber, Password).then(() => { // encrypt the password sha 256
        sendEmail(email, 'confirmation mail from clothxnet', `hello {ownerName}`, htmlMessage(storeId, ownerphoneNumber, Password))
        sendMessage(ownerphoneNumber, `your store /storeId ${storeId} has been registered successfully to clothx net with phone number ${ownerphoneNumber} and password ${Password}`)
      })
    })
  })
}
function htmlMessage (storeId, contactNumber, Password) {
  return `<p>your store  /storeId ${storeId} has been registered successfully to clothx net with phone number ${contactNumber} and password ${Password} </p>`
}
OncreateEmployee(123564, 9843158807, 123, 'prakash1729brt@gmail.com')
function encryptThepasswordOnce (sid, EmployeePhoneNUmber, password) {
  let hashedpassword = SHA256(password).toString().toLowerCase()
  return firestore.collection(`stores/${sid}/employees/`).doc(`${EmployeePhoneNUmber}`).update({password: hashedpassword})
}
