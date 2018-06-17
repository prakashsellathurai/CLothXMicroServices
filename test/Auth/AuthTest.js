var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
// auth app code

const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// allow gzip compression
app.use(compression())
// use helmet for safety
app.use(helmet())
// disable this header to eliminate targetted attacks
app.disable('x-powered-by')

app.post('/', (req, res) => requestHandler(req, res))

function requestHandler (req, res) {
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
function parseHeaders (req) {
  return { phoneNumber: req.headers.phonenumber, password: req.headers.password, sid: req.headers.sid }
}
function checkTheDatabase (sid, phoneNumber, password, res) {
  if (!checkIfStoreDocExist(sid)) {
    res.json({ isError: true, error: 'sid (store id doesnot exists)  does not exists' })
  } else if (!checkIfEmployeeExist(sid, phoneNumber)) {
    res.json({ isError: true, error: 'phoneNumber (phoneNumber doesnot exists)  does not exists' })
  } else 
}
function validateHeader (postedInfo, res) {
  if (!postedInfo.phoneNumber) { res.json({ isError: true, error: 'phonenumber Not Provided' }) } else
  if (!postedInfo.password) { res.json({isError: true, error: 'password not provided'}) } else
  if (!postedInfo.sid) { res.json({isError: true, error: 'sid not provided'}) } else
  if (!(postedInfo.phoneNumber && postedInfo.password && postedInfo.sid)) {
    res.json({ isError: true, error: 'Authentication info not provided refusing to accept' })
  }
  return true
}
function getEmployeeeData (sid, employeeID) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeID}`).get()
}
async function checkIfEmployeeExist (sid, employeeID) {
  let employeeDoc = await getEmployeeeData(sid, employeeID)
  return employeeDoc.exists
}
function getstoreData (sid) {
  return firestore.collection('stores').doc(`${sid}`).get()
}
async function checkIfStoreDocExist (sid) {
  let doc = await getstoreData(sid)
  return (doc.exists)
}
function hashpassword (password) {

}
app.listen(3030)

/*
error:
isError:
role:
type:
key:

*/
