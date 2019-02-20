const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let admin = require('./../../../functions/shared/environment/initAdmin').withrawdb()
let db = require('../../../functions/shared/firestore/CRUD')
const assert = chai.assert
var expect = chai.expect
let test_data = {
  storeId: 'o5TJXffUXswTmtpEmYcY',
  user_UID: 'w2DUjxHxBIQCuYg4LB0ZlALpD7r2',
  userEmail: 'nponmuthuselvam@gmail.com'
}
describe('firebase admin sdk', () => {
  it('should intiliaze admin', () => {
    expect(() => admin).to.not.throw()
  })
})
describe('db', () => {
  describe('#firestore', function () {
    let firestore = admin.firestore()
    it('should have collection property', () => {
      expect(firestore).to.have.property('collection')
    })
    it('should have doc property', () => {
      expect(firestore).to.have.property('doc')
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
})
