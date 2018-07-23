// uncomment this while production
var cryptoFunctions = require('../../utils/cryptographicFunctions/general')
var admin = require('firebase-admin')
// const settings = {timestampsInSnapshots: true}
var firestore = admin.firestore()
// firestore.settings(settings)
var storeModel = require('../../model/store')

function getEmployeeeData (sid, employeeID) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeID}`).get()
}
function GetClothDoc (storeId, clothId) {
  return firestore.collection(`stores/${storeId}/clothes`).doc(`${clothId}`)
}
function checkIfEmployeeExist (sid, employeeId) {
  return getEmployeeeData(sid, employeeId).then((employeeDoc) => {
    return (employeeDoc.exists)
  })
}

function getstoreData (sid) {
  return firestore.collection('stores').doc(`${sid}`).get().then((resolvedvalue) => resolvedvalue.data())
}

function checkIfStoreDocExist (sid) {
  return firestore.collection('stores').doc(`${sid}`).get().then((doc) => {
    return (doc.exists)
  })
}

function generateAuthToken (sid, phoneNumber, password, res) {
  if (!checkIfStoreDocExist(sid)) {
    res.json({ isError: true, error: 'sid  does not exists' })
  } else {
    return getEmployeeeData(sid, phoneNumber).then((employeeDoc) => {
      if (!employeeDoc.exists) {
        res.json({ isError: true, error: `phonenumber doesn't exists` })
      } else {
        let hashedPassword = cryptoFunctions.hashPassword(password)
        if (employeeDoc.data().password !== hashedPassword) {
          res.json({isError: true, error: 'password is wrong'})
        } else { // success
          let token = cryptoFunctions.generateHash(phoneNumber, password, sid)

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
function saveOWner (sid, ownerName, EmployeePhoneNUmber, password) {
  let hashedpassword = cryptoFunctions.hashPassword(password)
  return firestore.collection(`stores/${sid}/employees/`).doc(`${EmployeePhoneNUmber}`).set({
    name: ownerName,
    password: hashedpassword,
    role: 'owner'
  })
}
function storeEmployee (sid, EmployeePhoneNUmber, employeeDetails) {
  employeeDetails.password = cryptoFunctions.hashPassword(employeeDetails.password) //  encrypt and save the password
  return firestore.collection(`stores/${sid}/employees/`).doc(`${EmployeePhoneNUmber}`).set(employeeDetails)
}
function GetOwner (sid) {
  return firestore.collection(`stores/${sid}/employees/`).where('role', '==', 'owner').get()
}
function GetClothCollection (storeId) {
  return firestore.collection(`stores/${storeId}/clothes`).get()
}
function saveToken (token) {
  let payload = cryptoFunctions.decryptHash(token)
  let sid = payload.sid
  let phoneNumber = payload.phonenumber
  return firestore.collection(`stores/${sid}/employees`).doc(`${phoneNumber}`).update({'token': token}).then(val => {
    return getEmployeeeData(sid, phoneNumber)
  })
}
// ===================================================================== storeIndex related routines===========================================
function CountSize () {
  return GetStoreIndex().then(snap => {
    if (snap.exists && snap.data().storesCount) return snap.data().storesCount
    else {
      return IntiatiateStoreIndex().then((snap) => {
        return GetStoreIndex().then((snap) => snap.data().storesCount)
      })
    }
  })
}
function IncStoreIndex () {
  return CountSize().then(count => {
    return firestore.collection('DbIndex').doc('stores').update({ storesCount: count + 1 })
  })
}
function DecStoreIndex () {
  return CountSize().then(count => {
    return firestore.collection('DbIndex').doc('stores').update({ storesCount: count - 1 })
  })
}
function GetStoreIndex () {
  return firestore.collection('DbIndex').doc('stores').get()
}
function IntiatiateStoreIndex () {
  return firestore.collection('DbIndex').doc('stores').set({ storesCount: 1001 }).then(() => { return 1001 })
}
// ======================================================END OF STORE INDEX ROUTINES ======================================
// =======================================================db functions for store add / employee add ====================
function createEmployee (sid, employeeDAta) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeDAta.mobileNo}`).set(employeeDAta)
}
function createStoreByStoreLog (storelog) {
  return CountSize().then((sid) => {
    return createStore(sid, storeModel.MapStoreLog(sid, storelog))
      .then((ref) => IncStoreIndex())
      .then(() => sid)
  })
}
function AbsoluteCreateStore (storedata) {
  return CountSize().then((sid) => {
    return createStore(sid, storeModel.MapStoreLog(sid, storedata))
      .then((ref) => IncStoreIndex())
      .then(() => sid)
  })
}
function createStore (sid, StructuredStoredata) {
  return firestore.collection('stores').doc(`${sid}`).set(StructuredStoredata)
}
function storeQueryBySid (sid) {
  return firestore.collection('stores').where('sid', '==', sid).get().then(val => {
    let promises = []
    if (val.empty) {
      return Promise.resolve([1000])
    } else {
      val.docs.forEach(doc => {
        promises.push(doc.id)
      })
      return Promise.all(promises)
    }
  })
}
function checkIfsidExist (sid) {
  return firestore.collection('stores').where('sid', '==', sid).get().then(val => {
    let promises = []
    val.docs.forEach(doc => {
      promises.push(doc.id)
    })
    return Promise.all(promises)
  }).then(arr => {
    return arr.length > 0
  })
}
function addstorelog (uuid, doc) {
  return firestore.collection('/DbIndex/stores/addstorelog').doc(uuid).set(RemoveUndefinedValues(doc))
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}
module.exports = {
  generateAuthToken: generateAuthToken,
  savetoken: saveToken,
  getEmployeedata: getEmployeeeData,
  checkIfStoreExist: checkIfStoreDocExist,
  getStoreData: getstoreData,
  checkIfEmployeeExist: checkIfEmployeeExist,
  AddEmployee: storeEmployee,
  GetOwner: GetOwner,
  saveOwner: saveOWner,
  GetClothCollection: GetClothCollection,
  GetClothDoc: GetClothDoc,
  createStoreByStoreLog: createStoreByStoreLog,
  createEmployee: createEmployee,
  IncStoreIndex: IncStoreIndex,
  DecStoreIndex: DecStoreIndex,
  storeQueryBySid: storeQueryBySid,
  checkIfsidExist: checkIfsidExist,
  CountSize: CountSize,
  addstorelog: addstorelog,
  AbsoluteCreateStore: AbsoluteCreateStore
}
