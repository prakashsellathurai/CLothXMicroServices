const functions = require('firebase-functions')
const express = require('express')
const passwordRecovery = express()
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const path = require('path')

const db = require('../../../firestore/CRUD/db')
const CONSTANTS = require('../../../environment/CONSTANTS')
const sendmsg = require('../../../utils/message/SendMessage')
// #########################################################################3
// Automatically allow cross-origin requests
passwordRecovery.use(cors({ origin: true }))
// allow gzip compression
passwordRecovery.use(compression())
// use helmet for safety
passwordRecovery.use(helmet())
// disable this header to eliminate targetted attacks
passwordRecovery.disable('x-powered-by')

passwordRecovery.post('', (req, res) => MainHandler(req, res))
passwordRecovery.post('/', (req, res) => MainHandler(req, res))
passwordRecovery.use('/auth', (req, res) => PasswordResetHandler(req, res))

module.exports = functions.https.onRequest(passwordRecovery)

async function MainHandler (req, res) {
  let reqObj = RootRequestProcessor(req, res)
  let messageSent
  try {
    let resetToken = await db.EmployeePasswordResetTokenGenerator(reqObj.sid, reqObj.phonenumber)
    let resetLink = resetLinkGenerator(resetToken)
    let Message = `click this link   ${resetLink} to reset the password for clothx `
    messageSent = await sendmsg(reqObj.phonenumber, Message)
  } catch (e) {
    console.log(e)
    res.json({msg: 'server error '})
  }
  if (messageSent) {
    res.json({msg: 'reset request accepted'})
  } else {
    res.json({msg: 'server error'})
  }
}
function resetLinkGenerator (resetToken) {
  return `${CONSTANTS.PASSWORD_RESET_ROOT_URL}auth?token=${resetToken}`
}
function RootRequestProcessor (req, res) {
  let sid = req.params.sid
  let phonenumber = req.params.phonenumber
  if (isNotdefined(sid)) {
    res.json({ msg: 'storeid not provided' })
  } else if (isNotdefined(phonenumber)) {
    res.json({ msg: 'phonenumber not provided' })
  } else if (isNotdefined(sid) && isNotdefined(phonenumber)) {
    res.json({ msg: 'both sid and phonenumber not provided' })
  } else return { sid: sid, phonenumber: phonenumber }
}
async function PasswordResetHandler (req, res) {
  let authtoken = req.params.token
  if (isNotdefined(authtoken)) {
    res.sendFile(path.join(__dirname, '/public/invalid.html'))
  } else {
    res.sendFile(path.join(__dirname, '/public/index.html'))
  }
}
function isNotdefined (obj) {
  return obj === undefined || typeof obj === 'undefined' || obj === 'undefined'
}
