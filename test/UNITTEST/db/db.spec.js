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
  })
})
describe('db', async () => {
  let user = testDataprovider.user
  let store = testDataprovider.store

  describe('#associate', () => {
    before(async function () {
      await user.save()
      store.details = await user.registerTheStore(store.details)
    })

    let db = require('../../../functions/shared/firestore/CRUD/index')
    it('should associate store info to user ', async () => {
      expect(() => db.associate.storeInfoToUser(user.uid, store.registerUid)).to.not.throw()
    })
  
  })
  after(async function () {
    await user.delete()
    await store.delete()
  })
})
