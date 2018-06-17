// primary handler
var admin = require('firebase-admin')
var firestore = admin.firestore()
var tokenProvider = require('./AuthToken')
var SHA256 = require('crypto-js/sha256')
function validateHeader (postedInfo, res) {
  if (!(postedInfo.phoneNumber && postedInfo.password && postedInfo.sid)) {
    res.json({ isError: true, error: 'Authentication info not provided refusing to accept' })
  } else
  if (!postedInfo.phoneNumber) { res.json({ isError: true, error: 'phonenumber Not Provided' }) } else
  if (!postedInfo.password) { res.json({isError: true, error: 'password not provided'}) } else
  if (!postedInfo.sid) { res.json({isError: true, error: 'sid not provided'}) }

  return true
}
function getEmployeeeData (sid, employeeID) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeID}`).get()
}

function getstoreData (sid) {
  return firestore.collection('stores').doc(`${sid}`).get()
}
function checkIfStoreDocExist (sid) {
  return getstoreData(sid).then((doc) => {
    return (doc.exists)
  })
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
        res.json({ isError: true, error: `phonenumber doesn't exists` })
      } else {
        let hashedPassword = hashPassword(password)
        if (employeeDoc.data().password !== hashedPassword) {
          res.json({isError: true, error: 'password is wrong'})
        } else { // success
          let token = generateHash(phoneNumber, password, sid)

          let role = employeeDoc.data().role
          if (!role) {
            res.json({isError: true, error: 'user doesn,t have role'})
          } else {
            return getstoreData(sid).then((storedata) => {
              return saveToken(token).then((employeeDoc) => {
                res.json({ isError: false,
                  role: employeeDoc.data().role,
                  token: employeeDoc.data().token,
                  type: storedata.data().type,
                  phoneNumber: phoneNumber,
                  sid: sid,
                  name: employeeDoc.data().name })
              })
            })
          }
        }
      }
    })
  }
}
function saveToken (token) {
  let payload = decryptHash(token)
  let sid = payload.sid
  let phoneNumber = payload.phonenumber
  return firestore.collection(`stores/${sid}/employees`).doc(`${phoneNumber}`).update({'token': token}).then(val => {
    return getEmployeeeData(sid, phoneNumber)
  })
}
function hashPassword (password) {
  return SHA256(password).toString().toLowerCase()
}
// ********************* export the handler function******************************* //
module.exports.requestHandler = function requestHandler (req, res) {
  try {
    var postedInfo = parseHeaders(req)
    if (validateHeader(postedInfo, res)) {
      return checkTheDatabase(postedInfo.sid, postedInfo.phoneNumber, postedInfo.password, res)
    }
  } catch (e) {
    res.status(500)
    res.json({isError: true, error: 'server error'})
  }
}
