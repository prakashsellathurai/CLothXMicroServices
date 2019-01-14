const razorpay = require('./razorpay')
const createCustomer = () =>
  razorpay.CreateCustomer('kashfe', 'a@bd.com',)
    .then((res) => {
      console.log(res.id)
    })
    .catch((err) => {
      if (err) console.log(err)
    })

const createPlan = () => razorpay
  .CreatePlan(
    { 'period': 'weekly',
      'interval': 1,
      'item': {
        'name': 'Test Weekly 1 plan',
        'description': 'Description for the weekly 1 plan',
        'amount': 600,
        'currency': 'INR'
      }

    }
  ).then((res) => {
    console.log(res)
  }).catch((err) => {
    if (err) console.log(err)
  })
const createSubscription = () => razorpay
  .CreateSubscription({

    'plan_id': 'plan_BEyQ9Yg4vCIlsa',
    'customer_notify': 1,
    'total_count': 6,
    'start_at': 1844118954,
    'addons': [
      {
        'item': {
          'name': 'Delivery charges',
          'amount': 30000,
          'currency': 'INR'
        }
      }
    ]

  }).then((res) => {
    console.log(res)
  }).catch((err) => {
    if (err) console.log(err)
  })
createCustomer()
