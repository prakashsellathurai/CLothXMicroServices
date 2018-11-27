const chai = require('chai')
const assert = chai.assert
var expect = chai.expect
let db = require('./../functions/shared/firestore/CRUD/index')
let test_data = {
  storeId: 'o5TJXffUXswTmtpEmYcY',
  userId: 'prakash1729brt@gmail.com'
}
describe('dbcore test', () => {
  it('should intialize admin', () => {
    let admin = db.admin
    let firestore = db.firestore
    assert.isObject(admin, 'admin is not intialized')
    assert.isDefined(firestore, 'firestore not is defined')
  })
  it('should associate store with info', async () => {
    const userEmail = await db.associate.storeInfoToUser(test_data.userId, test_data.storeId)
    userEmail.should.equal(test_data.userId)
  })
})
