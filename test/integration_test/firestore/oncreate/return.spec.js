const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
var assert = chai.assert
require('./../../../../functions/shared/environment/initAdmin').withrawdb()
const returnModule = require('./../../../../functions/shared/modules/firestore/oncreate/return.module')
const create = require('./../../../../functions/shared/firestore/CRUD').create
describe('oncreateReturn', () => {
  it(' should run without error', async () => {
    assert.ok(await returnModule())
  })
})
