
function isBlank (str) {
  return (!str || /^\s*$/.test(str))
}
function isNumeric (n) {
  if (!isNaN(n) && !isBlank(n)) {
    return Number(n)
  } else {
    return n
  }
}
console.log(isNumeric('555')/2)
