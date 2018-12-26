const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let assert = chai.assert
var expect = chai.expect
let admin = require('./../../../functions/shared/environment/initCloudinary').withCredentials()
let save = require('./../../../functions/shared/utils/integrations/cloudinary/save')
describe('cloudinary client', () => {
  it('should intiate without error', () => {
    expect(() => admin).to.not.throw()
  })
  it('should save product', async () => {
    let sv = await save.product('https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png')
    expect(() => sv).to.not.throw()
    expect(sv).to.be.a('object')
    expect(sv.secure_url).to.be.a('string')
  })
})

