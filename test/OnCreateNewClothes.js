var admin = require('firebase-admin')

var serviceAccount = require('../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function OnCreateNewcCLothes (userId, clothId, crn) {
  let promises = []
  var nextIndexPointer
  // db refrerences
  var userRef = firestore.collection('user').doc(userId)
  var clothRef = firestore.collection(`user/${userId}/clothes/`).doc(`${clothId}`)
  // get Next Index POinTR
  var getCrnIndexNextPointer = userRef.get().then(userDoc => { return (!userDoc.exists) ? undefined : userDoc.data().nextIndexPointer })

  // Intialize a pointer if anything doesn't exist
  var IntializeNextIndexPointer = userRef.set({crnIndex: { nextIndexPointer: 1 }}, { merge: true }).then(result => 1)

  // get or Intialize Index Pointer
  var GetOrInitializeNextIndexPointer = () => { return (getCrnIndexNextPointer !== undefined) ? getCrnIndexNextPointer : IntializeNextIndexPointer }

  // load the next IndexPointer in Run TIme
  function updateLocalIndexPointer () {
    return GetOrInitializeNextIndexPointer().then(val => { nextIndexPointer = val })
  }

  // var save the next IndexPointer to crn Of clothes
  function StorenextIndexPointerinFirestore () {
    return clothRef.set({crn: nextIndexPointer})
  }

  // push to promises
  promises.push(updateLocalIndexPointer, StorenextIndexPointerinFirestore)

  // resolv all iterable promises
  return Promise.all([promises])
}
var clothId = Math.random().toString(36).substr(2, 19)
var crn = Math.random() * 10
console.log(clothId, crn)
OnCreateNewcCLothes('ZPnEUNe3l7NR0LYFj0dH', clothId, crn)
