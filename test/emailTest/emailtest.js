var email = require('../../functions/utils/Mail/sendmail')
var msg = require('../..//functions/utils/message/SendMessage')

email('15eumt082@skcet.ac.in', 'test', 'text', '<h1>hey BOOOOY</h1>').then(val => {
  return msg(8015515120, 'heeloeenvanvldvlidbvil').then(val => {
    console.log(val)
  })
})
