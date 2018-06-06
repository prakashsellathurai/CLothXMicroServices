const OFFICIAL_EMAIL = 'prakash1729brt@gmail.com'// 'hello@clothx.net'
const OFFICIAL_PASS = 'mechatronics' //  'clothxnet'
const APP_NAME = 'clothX'
const SMTP_HOST = 'smtp.google.com'
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

function zohoTransport () {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: 465,
    secure: true, // use SSL
    auth: {
      user: OFFICIAL_EMAIL,
      pass: OFFICIAL_PASS
    }
  })
}

function gmailTransport () {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      xoauth2: xoauth2.createX
    }
  })
}
function sendMail (email) {
  var transporter = gmailTransport()
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
sendMail('15eumt082@skcet.ac.in')
