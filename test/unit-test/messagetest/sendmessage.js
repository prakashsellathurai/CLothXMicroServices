var sendMessage = require('./../../../functions/shared/utils/message/SendMessage')
sendMessage(9843158807, `We hope you enjoyed your shopping. We would Love to hear your feedback. Click `)
  .then((body) => JSON.parse(body))
  .then((body) => {
    console.log(body)
  })
