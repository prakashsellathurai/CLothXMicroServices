var dbFunctions = require('../../../../shared/firestore/CRUD/db')
function validateHeader (postedInfo, res) {
  if (!(postedInfo.phoneNumber && postedInfo.password && postedInfo.sid)) {
    res.json({ isError: true, error: 'Authentication info not provided refusing to accept' })
  } else if (!postedInfo.sid) { res.json({isError: true, error: 'sid not provided'}) } else
  if (!postedInfo.phoneNumber) { res.json({ isError: true, error: 'phonenumber Not Provided' }) } else
  if (!postedInfo.password) { res.json({isError: true, error: 'password not provided'}) }
  return true
}
function parseHeaders (req) {
  return { phoneNumber: req.headers.phonenumber, password: req.headers.password, sid: req.headers.sid }
}
// ********************* export the handler function******************************* //
module.exports.requestHandler = function requestHandler (req, res) {
  try {
    var postedInfo = parseHeaders(req)
    if (validateHeader(postedInfo, res)) {
      return dbFunctions.generateAuthToken(postedInfo.sid, postedInfo.phoneNumber, postedInfo.password, res)
    }
  } catch (e) {
    res.status(500)
    res.json({isError: true, error: 'server error'})
  }
}
