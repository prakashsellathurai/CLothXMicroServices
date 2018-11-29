var sendMessage = require('./../../../functions/shared/utils/message/SendMessage');
sendMessage('', 'helloooooo')
.then((body) => JSON.parse(body))
.then((body) => {
    console.log(body)
})