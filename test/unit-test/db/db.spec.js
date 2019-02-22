const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let admin = require('./../../../functions/shared/environment/initAdmin').setCredentials()
let db = require('../../../functions/shared/firestore/CRUD')
const assert = chai.assert
var expect = chai.expect
let test_data = {
  storeId: 'o5TJXffUXswTmtpEmYcY',
  user_UID: 'w2DUjxHxBIQCuYg4LB0ZlALpD7r2',
  userEmail: 'nponmuthuselvam@gmail.com'
}
describe('firebase admin sdk', function () {
  it('should intiliaze admin', function () {
    expect(() => admin).to.not.throw()
  })
})
describe('db', function () {
  describe('#firestore', function () {
    let firestore = admin.firestore()
    it('should have collection property', function () {
      expect(firestore).to.have.property('collection')
    })
    it('should have doc property', function () {
      expect(firestore).to.have.property('doc')
    })
    it('should set product', async function () {
      let productid = 'gchgvgc'
      let data = {}
      let createProduct = await db.create.product(productid, data)
      let setProduct = await db.set.RandomObjectIdToProduct(productid, 'yuuyvuvu')
      if (createProduct) {
        expect(setProduct).to.be.an('Object')
        expect(setProduct).to.have.property('objectID')
        expect(setProduct).to.have.property('cloudinaryUrl')
      }
    })
    it('should update customer reward', async function () {
      const givenCustomerData = {
        'storeId': `5555555`,
        'customerNumber': `jdjcdbbdcbd`,
        'customerName': 515115151,
        'createdOn': new Date(),
        'totalPrice': 8425,
        'totalQuantity': 455
      }
      let _update = await db.update.customerReward(
        givenCustomerData.customerNumber,
        givenCustomerData.storeId,
        givenCustomerData.customerName,
        givenCustomerData.totalQuantity,
        givenCustomerData.totalPrice,
        givenCustomerData.createdOn
      )
      expect(_update).to.equal(200)
    })
  })
  it('should get ProductsIn Store', async function () {
    let Products = await db.get.ProductInStore('eIGNV5kDx1JuMCn3td3W')
    expect(Products).to.be.an('Array')
  })
})
