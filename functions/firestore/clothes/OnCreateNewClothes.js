
var admin = require('firebase-admin')
var functions = require('firebase-functions')

admin.initializeApp(functions.config())
var firestore = admin.firestore()
var OncreateNewClothes = functions.firestore
  .document('user/{userId}/clothes/{clothId}')
  .onCreate((snap, context) => {
    // local variables
    const userId = context.params.userId
    const clothId = context.params.clothId
    var nextIndexPointer
    let promises = []
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
  })
module.exports = OncreateNewClothes
