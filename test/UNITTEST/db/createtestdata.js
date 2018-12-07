'use strict'
// imports models
var User = require('./../../../functions/shared/model/user')
var Store = require('./../../../functions/shared/model/store')
let userData = {
  email: 'a@b.com',
  uid: 'gstfkhvjgbkjkugit67487yvygiu',
  displayName: 'test_user',
  photoUrl: 'https://www.google.co.in/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png',
  token: 'abeccudbceuecencococc'
}
let storeData = {
  storeName: 'teststore',
  mobileNumber: '9843158807',
  // this.contactNumber = data.contactNumber;
  address: 'test street',
  gstNumber: 'nooo',
  typeOfStore: 'fuii',
  hasNoGstNumber: false
}
let user = new User(userData)
let store = new Store(storeData)
module.exports = {
  user: user,
  store: store
}
