var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var tokenProvider = require('../../functions/Auth/AuthToken')
var SHA256 = require('crypto-js/sha256')
var firestore = admin.firestore()
// auth app code
function getstoreData (sid) {
    return firestore.collection('stores').doc(`${sid}`).get()
  }
function checkIfStoreDocExist (sid) {
    return getstoreData(sid).then((doc) => {
      return (doc.exists)
    })
  }
  function getEmployeeeData (sid, employeeID) {
    return firestore.collection(`stores/${sid}/employees`).doc(`${employeeID}`).get()
  }
  function parseHeaders (req) {
    return { phoneNumber: req.headers.phonenumber, password: req.headers.password, sid: req.headers.sid }
  }
  
  function generateHash (phoneNumber, password, sid) {
    return tokenProvider.encode(phoneNumber, password, sid)
  }
  function decryptHash (token) {
    return tokenProvider.decode(token)
  }
function checkTheDatabase (sid, phoneNumber, password, res) {
  if (!checkIfStoreDocExist(sid)) {
    res.json({ isError: true, error: 'sid (store id doesnot exists)  does not exists' })
  } else {
    return getEmployeeeData(sid, phoneNumber).then((employeeDoc) => {
      if (!employeeDoc.exists) {
        res.json({ isError: true, error: 'phoneNumber (phoneNumber doesnot exists)  does not exists' })
      } else {
        let hashedPassword = hashPassword(password)
        if (employeeDoc.password !== hashedPassword) {
          res.json({isError: true, error: 'password is wrong'})
        } else { // success
          let token = generateHash(phoneNumber, password, sid)

          let role = employeeDoc.role
          if (!role) {
            res.json({isError: true, error: 'user doesn,t have role'})
          } else {
            return getstoreData(sid).then((storedata) => {
              return saveToken(token).then((employeeDoc) => {
                res.json({isError: false, role: employeeDoc.role, token: employeeDoc.token, type: storedata.type})
              })
            })
          }
        }
      }
    })
  }
}
