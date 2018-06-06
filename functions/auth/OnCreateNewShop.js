const nodemailer = require('nodemailer')
// constants
const environment = require('../environment/CONSTANTS')
const OFFICIAL_EMAIL = environment.OFFICIAL_EMAIL
const OFFICIAL_PASS = environment.OFFICIAL_PASS
const APP_NAME = environment.APP_NAME

function sendMail (email) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: OFFICIAL_EMAIL,
      pass: OFFICIAL_PASS
    }
  })

  // setup e-mail data
  var mailOptions = {
    from: OFFICIAL_EMAIL, // sender address (who sends)
    to: `${email}`, // list of receivers (who receives)
    subject: `Email verfication for ${APP_NAME}`, // Subject line
    html: 'click this link to verify your email' // html body
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error)
    }
    return console.log('Message sent: ' + info.response)
  })
}

module.exports = {
  sendMail: sendMail
}
