
var crnIndex = {
  nextIndexPointer: 2
}

function crnAssigner (crnIndex) {
  let deletedIndex = (_has(crnIndex, 'deletedIndex')) ? crnIndex.deletedIndex : undefined
  let IndexPointer = crnIndex.nextIndexPointer
  if (isUndefined(deletedIndex) && isUndefined(IndexPointer)) return 1
  else if (deletedIndex === undefined && IndexPointer > 0) return IndexPointer + 1
  else return (deletedIndex.length > 0) ? Math.min(IndexPointer, Math.min.apply(null, deletedIndex)) : IndexPointer
}
function isUndefined (obj) {
  return obj === false || obj === null || obj === undefined
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
let val = crnAssigner(crnIndex)
let value = popPositionFromDeletedIndex([1, 2, 4, 4, 5, 1, 1, 1, 1, 1, 2], 5)
console.log(value)
function removeDuplicates (arr) {
  return [...new Set(arr)]
}
function popPositionFromDeletedIndex (array, position) {
  var index = array.indexOf(position)
  if (index > -1) {
    array.splice(index, 1)
  }
  return removeDuplicates(array)
}
