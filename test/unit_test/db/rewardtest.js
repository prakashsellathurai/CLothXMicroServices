const update = require('./../../../functions/shared/firestore/CRUD/update')

for (let index = 0; index < 5000; index++) {
  const givenCustomerData = {
    'storeId': 5000000000 - index,
    'customerNo': index,
    'customerName': 515115151,
    'createdOn': new Date(),
    'totalPrice': 8425,
    'totalQuantity': 455
  }
  update.customerReward(givenCustomerData)
}
for (let index = 0; index < 5000; index++) {
  const givenCustomerData = {
    'storeId': '5B0KafsIRdKJ0sup7PAT',
    'customerNo': index,
    'customerName': 515115151,
    'createdOn': new Date(),
    'totalPrice': 8425,
    'totalQuantity': 455
  }
  update.customerReward(givenCustomerData)
}
