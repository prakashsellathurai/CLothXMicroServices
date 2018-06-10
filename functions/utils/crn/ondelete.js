function ondeleteHandler (userRef, clothRef, crnContentref, crn, userId, clothId) {
  return emptyTheCrnContentIndex(crnContentref, crn).then((result) => {
    return pushTodeletedIndexes(userRef, crn)
  })
}
function emptyTheCrnContentIndex (crnContentref, crn) {
  return crnContentref.doc(`${crn}`).update({clothRef: '', id: ''})
}
function pushTodeletedIndexes (userRef, crn) {
  return getCRNIndex(userRef).then((crnIndex) => {
    var array = (isArray(crnIndex.deletedIndex) ? crnIndex.deletedIndex : [])
    let deletedIndex = (CheckDeletedIndex(crnIndex)) ? array.slice() : []
    deletedIndex.push(crn)
    return UpdateCrnIndex(userRef, deletedIndex)
  })
}
function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}
function UpdateCrnIndex (userRef, deletedIndex) {
  return userRef.set({'crnIndex': {'deletedIndex': deletedIndex}}, { merge: true })
}
function CheckDeletedIndex (crnIndex) {
  return (_has(crnIndex, 'deletedIndex'))
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
function getCRNIndex (userRef) {
  return userRef.get().then((doc) => { return doc.data().crnIndex })
}
module.exports.ondeleteHandler = ondeleteHandler
