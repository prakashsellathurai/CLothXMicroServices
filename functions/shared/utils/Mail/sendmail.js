var nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'hello@clothx.net',
    pass: 'clothxnet'
  }
})
function sendmail (toEmail, subject, text, html) {
  return new Promise(function (resolve, reject) {
    var mailOptions = {
      from: '<hello@clothx.net>', // sender address (who sends)
      to: toEmail, // list of receivers (who receives)
      subject: subject, // Subject line
      text: text, // plaintext body
      html: html// html body
    }
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error)
        return console.log(error)
      }

      console.log('Message sent: ' + info.response)
      resolve(info.response)
    })
  })
}

module.exports = sendmail
