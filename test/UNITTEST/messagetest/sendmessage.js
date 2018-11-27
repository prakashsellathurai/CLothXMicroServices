var sendMessage = require('./../../../functions/shared/utils/message/SendMessage');
sendMessage(9843158807, 'helloooooo')
.then((body) => JSON.parse(body))
.then((body) => {
    console.log(body)
})