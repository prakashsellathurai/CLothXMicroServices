function OncreateHandler (userId, clothId, userRef, clothRef, crnContentref) {
  return getNextIndexPointer(userRef).then(nextIndexPointer => {
    return (AssignNextPointerToClothId(nextIndexPointer, clothRef))
  }).then((position) => {
    return (AddCRNContentEntry(crnContentref, clothRef.path, position))
  }).then((position) => {
    return UpdateCRNIndex(userRef, position)
  })
}

function popPositionFromDeletedIndex (array, position) {
  var index = array.indexOf(position)
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}
function removeDuplicates (arr) {
  let uniqueArray = []
  for (let i = 0; i < arr.length; i++) {
    if (uniqueArray.indexOf(arr[i]) === -1) {
      uniqueArray.push(arr[i])
    }
  }
  return uniqueArray
}
// update crnIndex
function UpdateCRNIndex (userRef, position) {
  return GetCRNINDEX(userRef).then((crnIndex, deletedIndex) => {
    if (isUndefined(deletedIndex)) { return userRef.update({ 'crnIndex.nextIndexPointer': position + 1 }) } else {
      let updatedDeletedIndex = popPositionFromDeletedIndex(deletedIndex, position)
      console.log(updatedDeletedIndex)
      return userRef.set({'crnIndex.nextIndexPointer': position + 1, 'crnIndex.deletedIndex': updatedDeletedIndex})
    }
  })
}
// get crnIndex
function GetCRNINDEX (userRef) {
  return userRef.get().then((doc) => {
    return (doc.data().crnIndex, (_has(doc.data().deletedIndex)) ? doc.data().deletedIndex : [])
  })
}
// Add crnContent Entry to crnContent
function AddCRNContentEntry (crnContentref, clothRefPath, position) {
  return crnContentref.doc(`${position}`).set({clothRef: clothRefPath, id: position}).then(val => { return position })
}

// assign next pointer value to current clothid functions
function AssignNextPointerToClothId (crnIndex, clothRef) {
  let position = crnAssigner(crnIndex)
  return clothRef.set({crn: position}, {merge: true}).then(val => { return position })
}

// get next pointer related functions
function getNextIndexPointer (userRef) {
  return userRef.get().then(doc => {
    return (_has(doc.data().crnIndex, 'nextIndexPointer')) ? doc.data().crnIndex : InitializeNextPointer(userRef)
  })
}
function InitializeNextPointer (userRef) {
  return userRef.set({crnIndex: { nextIndexPointer: 1 }}).then(val => { return { crnIndex: { nextIndexPointer: 1 } } })
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
function crnAssigner (crnIndex) {
  let deletedIndex = (_has(crnIndex, 'deletedIndex')) ? crnIndex.deletedIndex : undefined
  let IndexPointer = crnIndex.nextIndexPointer
  if (isUndefined(deletedIndex) && isUndefined(IndexPointer)) return 1
  else if (deletedIndex === undefined && IndexPointer > 0) return IndexPointer
  else return (deletedIndex.length > 0) ? Math.min(IndexPointer, Math.min.apply(null, deletedIndex)) : IndexPointer
}
function isUndefined (obj) {
  return obj === false || obj === null || obj === undefined
}
module.exports = { OncreateHandler: OncreateHandler }
