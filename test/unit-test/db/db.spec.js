var it = require('mocha').it
var describe = require('mocha').describe

const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

let admin = require('./../../../functions/shared/environment/initAdmin').setCredentials()
let db = require('../../../functions/shared/firestore/CRUD')
var expect = chai.expect

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
    it('should get ProductsIn Store', async function () {
      let Products = await db.get.ProductInStore('eIGNV5kDx1JuMCn3td3W')
      expect(Products).to.be.an('Array')
    })
  })
  describe('#utils', function () {
    it('should return false for wrong storeId', async function () {
      let storeId = 'yfttfu'
      let isExist = await db.utils.storeIdExists(storeId)
      expect(isExist).to.eql(false)
    })
    it('should return true for correcr storeId', async function () {
      let storeId = '2rOMoycHlZC3ph5PfSdy'
      let isExist = await db.utils.storeIdExists(storeId)
      expect(isExist).to.eql(true)
    })
    it('should return true for correct storeIds', async function () {
      let storeId = ['2rOMoycHlZC3ph5PfSdy', '5BZRRIrHd3jVy6oF9qei']
      let isExist = await db.utils.storeIdsExists(storeId)
      expect(isExist).to.eql(true)
    })
    it('should return false for incorrect storeIds', async function () {
      let storeId = ['2rOMoycHlZC3ph5PfSdy', 'ddd']
      let isExist = await db.utils.storeIdsExists(storeId)
      expect(isExist).to.eql(false)
    })
    it('should return true for uid provided in the database', async function () {
      let uid = 'RDeKiMgFsLMAHBpqmQ8ZBOM3IPq1'
      let isExist = await db.utils.uidExist(uid)
      expect(isExist).to.eql(true)
    })
    it('should return true for uid provided in the database', async function () {
      let uid = 'RDeKiMgFsLMAHdjvhdpqmQ8ZBOM3IPq1'
      let isExist = await db.utils.uidExist(uid)
      expect(isExist).to.eql(false)
    })
  })
})
