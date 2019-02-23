// r"""
// # Validate a CSV string having single, double or un-quoted values.
// ^                                   # Anchor to start of string.
// \s*                                 # Allow whitespace before value.
// (?:                                 # Group for value alternatives.
//   '[^'\\]*(?:\\[\S\s][^'\\]*)*'     # Either Single quoted string,
// | "[^"\\]*(?:\\[\S\s][^"\\]*)*"     # or Double quoted string,
// | [^,'"\s\\]*(?:\s+[^,'"\s\\]+)*    # or Non-comma, non-quote stuff.
// )                                   # End group of value alternatives.
// \s*                                 # Allow whitespace after value.
// (?:                                 # Zero or more additional values
//   ,                                 # Values separated by a comma.
//   \s*                               # Allow whitespace before value.
//   (?:                               # Group for value alternatives.
//     '[^'\\]*(?:\\[\S\s][^'\\]*)*'   # Either Single quoted string,
//   | "[^"\\]*(?:\\[\S\s][^"\\]*)*"   # or Double quoted string,
//   | [^,'"\s\\]*(?:\s+[^,'"\s\\]+)*  # or Non-comma, non-quote stuff.
//   )                                 # End group of value alternatives.
//   \s*                               # Allow whitespace after value.
// )*                                  # Zero or more additional values
// $                                   # Anchor to end of string.
// """
module.exports = function detectCSV (chunk, opts) {
  opts = opts || {}
  if (Buffer.isBuffer(chunk)) chunk = chunk + ''
  var delimiters = opts.delimiters || [',', ';', '\t', '|']
  var newlines = opts.newlines || ['\n', '\r']

  var lines = chunk.split(/[\n\r]+/g)

  var delimiter = determineMost(lines[0], delimiters)
  var newline = determineMost(chunk, newlines)

  if (!delimiter) {
    if (!newline) return false
    else if (isQuoted(lines[0])) return true
    else return false
  } else {
    return true
  }
}

function determineMost (chunk, items) {
  var ignoreString = false
  var itemCount = {}
  var maxValue = 0
  var maxChar
  var currValue
  items.forEach(function (item) {
    itemCount[item] = 0
  })
  for (var i = 0; i < chunk.length; i++) {
    if (chunk[i] === '"') ignoreString = !ignoreString
    else if (!ignoreString && chunk[i] in itemCount) {
      currValue = ++itemCount[chunk[i]]
      if (currValue > maxValue) {
        maxValue = currValue
        maxChar = chunk[i]
      }
    }
  }
  return maxChar
}

function isQuoted (chunk) {
  // is correctly quoted
  var nextQuote = false
  if (chunk[0] !== '"') return false
  if (chunk[chunk.length - 1] !== '"') return false
  for (var i = 1; i < chunk.length - 1; i++) {
    if (chunk[i] === '"') nextQuote = !nextQuote
    else if (nextQuote) return false
  }
  return !nextQuote
}
