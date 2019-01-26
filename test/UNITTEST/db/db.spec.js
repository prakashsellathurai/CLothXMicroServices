'use strict'

// imports for testing
const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect

// initiate test admin environment
let init = require('./../../../scripts/firestore/mockups/initiateClothxtestAdmin')
let admin = init.test_admin()

// test_data
let testDataprovider = require('./createtestdata')

describe('firebase admin sdk', () => {
  it('should intiliaze admin', () => {
    expect(() => admin).to.not.throw()
  })
  describe('#firestore', function () {
    let firestore = admin.firestore()
    it('should have collection property', () => {
      expect(firestore).to.have.property('collection')
    })
    it('should have doc property', () => {
      expect(firestore).to.have.property('doc')
    })
    it('should update the invoice on return of products', async () => {
   
    })
  })
})
describe('db', async () => {
  let user = testDataprovider.user
  let store = testDataprovider.store
  let product = testDataprovider.product
  before(async function () {

  })
  let db = require('../../../functions/shared/firestore/CRUD/index')
  it('should associate store info to user ', async () => {
    expect(async () => {
      store.details = await user.registerTheStore(store.details)
      await store.save()
      await user.save()
      return db.associate.storeInfoToUser(user.uid, store.registerUid)
    }).to.not.throw()
  })
  it('should assign random id to products', async () => {
    await product.save()
    let operation = await db.set.RandomObjectIdToProduct(product.productUid, [])
    expect(() => operation).to.not.throw()
    expect(operation).to.have.property('prn')
    expect(operation).to.have.property('variants')
    expect(operation).to.have.nested.property('variants[0].objectID')
  })
  after(async function () {
    await user.delete()
    await store.delete()
    await product.delete()
  })
})
