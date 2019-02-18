const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let admin = require('./../../../functions/shared/environment/initAdmin').withrawdb()
let db = require('../../../functions/shared/firestore/CRUD')
var expect = chai.expect
describe('firebase admin sdk', () => {
  it('should intiliaze admin', () => {
    expect(() => admin).to.not.throw()
  })
})
describe('#firestore', async () => {
  let firestore = admin.firestore()
  it('should have collection property', () => {
    expect(firestore).to.have.property('collection')
  })
  it('should have doc property', () => {
    expect(firestore).to.have.property('doc')
  })
})
describe('db', () => {
  it('should export files ', () => {
    expect(Object.keys(db)).to.eql([ 'create',
      'update',
      'reduce',
      'return',
      'associate',
      'delete',
      'assign',
      'get',
      'set',
      'timestamp',
      'utils',
      'log' ])
  })
  it('should set product', async () => {
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
})
