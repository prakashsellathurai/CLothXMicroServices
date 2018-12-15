'use strict'
// imports models
var User = require('./../../../functions/shared/model/user')
var Store = require('./../../../functions/shared/model/store')
var Product = require('./../../../functions/shared/model/product')
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
function generateProduct () {
  let product = new Product({
    productUid: generateRandomString(),
    prn: generateRandomString(),
    description: generateRandomString(),
    categories: generateRandomArray(4),
    gender: RandomGenderGen(),
    isDeleted: RandomBoolean()
  })
  return AddVariantByRandom(product)
}
function generateRandomString () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
function generateRandomArray (n) {
  return Array.from({length: n}, () => generateRandomString())
}
function RandomGenderGen () {
  let gender = ['Men', 'Women', 'Kids']
  return gender[Math.floor(Math.random() * gender.length)]
}
function RandomBoolean () {
  return Math.random() >= 0.5
}
function GenerateRandomNumber (n) {
  return Math.floor(Math.random() * n)
}
function AddVariantByRandom (product) {
  let n = GenerateRandomNumber(100)
  for (let index = 0; index < GenerateRandomNumber(n); index++) {
    product.addVariantByProperty(GenerateRandomNumber(n), GenerateRandomNumber(n), GenerateRandomNumber(n), GenerateRandomNumber(n))
  }
  return product
}
let user = new User(userData)
let store = new Store(storeData)
let product = generateProduct()
module.exports = {
  user: user,
  store: store,
  product: product
}
