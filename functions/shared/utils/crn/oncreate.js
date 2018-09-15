// *****************************************************  ***********************************************************************************
// *****************************************************************************************************************************************
// get next pointer related functions
function GetOrIntializeCRNINDEX (userRef) {
  return GetCRNINDEX(userRef).then((crnIndex) => { return (_has(crnIndex, 'nextIndexPointer')) ? crnIndex : InitializeNextPointer(userRef) })
}
function InitializeNextPointer (userRef) {
  return userRef.set({crnIndex: { nextIndexPointer: 1 }}).then(val => { return { nextIndexPointer: 1 } })
}

// *****************************************************  ***********************************************************************************
// *****************************************************************************************************************************************
/* crnALLOCATOR FUNCTIONs */
function crnAllocator (crnIndex) {
  var [deletedIndex, IndexPointer] = crnIndexParser(crnIndex)
  return allocationCoreUnit(deletedIndex, IndexPointer)
}

function allocationCoreUnit (deletedIndex, IndexPointer) {
  return (checkIfcrnIndexISUNDEFINED(IndexPointer, deletedIndex)) ? 1 : (checkIfDEletedIndexISUndefined(IndexPointer, deletedIndex)) ? IndexPointer : (deletedIndex.length > 0) ? checkminimumNumberToAllocate(IndexPointer, deletedIndex) : IndexPointer
}
function checkIfDEletedIndexISUndefined (IndexPointer, deletedIndex) {
  return deletedIndex === undefined && IndexPointer > 0
}
function checkIfcrnIndexISUNDEFINED (IndexPointer, deletedIndex) {
  return (isUndefined(deletedIndex) && isUndefined(IndexPointer))
}
function checkminimumNumberToAllocate (IndexPointer, deletedIndex) {
  return Math.min(IndexPointer, Math.min.apply(null, deletedIndex))
}
function isUndefined (obj) {
  return obj === false || obj === null || obj === undefined || typeof obj === 'undefined'
}
function crnIndexParser (crnIndex) {
  return [ (_has(crnIndex, 'deletedIndex')) ? crnIndex.deletedIndex : undefined, (_has(crnIndex, 'nextIndexPointer')) ? crnIndex.nextIndexPointer : undefined ]
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}

// *****************************************************  ***********************************************************************************
// *****************************************************************************************************************************************
// Add crnContent Entry to crnContent
function AddCRNContentEntry (crnContentref, clothRefPath, position) {
  return crnContentref.doc(`${position}`).set({clothRef: clothRefPath, id: position}).then((val) => { return position })
}

// assign next pointer value to current clothid functions
function AssignNextPointerToClothId (clothRef, position) {
  return clothRef.set({crn: position}, {merge: true}).then(val => { return position })
}

// *****************************************************  ***********************************************************************************
// *****************************************************************************************************************************************
function popPositionFromDeletedIndex (array, position) {
  var index = array.indexOf(position)
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}
function removeDuplicates (arr) {
  return [...new Set(arr)]
}
// update crnIndex
function UpdateCRNIndex (userRef, crnContentref, addedCRnContententry) {
  return GetCRNINDEX(userRef).then((crnIndex) => {
    let [deletedIndex, nextIndexpointer] = crnIndexParser(crnIndex)
    return nextIndexPointerController(crnContentref).then((position) => {
      let updatedDeletedIndex = (!isUndefined(deletedIndex)) ? popPositionFromDeletedIndex(deletedIndex, addedCRnContententry) : undefined
      if (isUndefined(updatedDeletedIndex)) { return nextIndexPointerPLUSPLUS(userRef, position) } else { return REFREShCRNINDEX(userRef, position, updatedDeletedIndex) }
    })
  })
}
function nextIndexPointerController (crnContentref) {
  return crnContentref.get().then(snap => { return snap.size })
}
function nextIndexPointerPLUSPLUS (userRef, position) {
  return userRef.update({ 'crnIndex.nextIndexPointer': position + 1 })
}
function REFREShCRNINDEX (userRef, nextIndexPointer, updatedDeletedIndex) {
  return userRef.set({'crnIndex': { 'nextIndexPointer': nextIndexPointer + 1, 'deletedIndex': removeDuplicates(updatedDeletedIndex) }}, { merge: true })
}
// get crnIndex
function GetCRNINDEX (userRef) {
  return userRef.get().then((doc) => { return returnCRNINDEXOBJECT(doc) })
}
function returnCRNINDEXOBJECT (doc) {
  let [deletedIndex, nextIndexPointer] = crnIndexParser(extractCrnIndex(doc))
  return { nextIndexPointer, deletedIndex }
}
function extractCrnIndex (doc) {
  return doc.data().crnIndex
}

// *********************************************************************************************************************************
// --------------------------------------------------------------------------------------------------------------------------------
// =================================>>>>>>>>>>> coreHAndler <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<=======================
module.exports.OncreateHandler = function OncreateHandler (userRef, clothRef, crnContentref) {
  return GetOrIntializeCRNINDEX(userRef) /* get or initialize CRNINDEX */
    .then((crnIndex) => { return crnAllocator(crnIndex) /* aloocate crn */ })
    .then((positionToassign) => { return AssignNextPointerToClothId(clothRef, positionToassign) })
    .then((assignedposition) => { return AddCRNContentEntry(crnContentref, clothRef.path, assignedposition) })
    .then((addedCRnContententry) => { return UpdateCRNIndex(userRef, crnContentref, addedCRnContententry) })
}