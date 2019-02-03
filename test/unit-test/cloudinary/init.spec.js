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
    let sv = await save.product('https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_272x92dp.png', 'testFolder')
    expect(() => sv).to.not.throw()
    expect(sv).to.be.a('object')
    expect(sv.secure_url).to.be.a('string')
  })
  it('should save array of pictures',async () => {
    let urlarray = [
      'https://opensource.org/files/osi_keyhole_300X300_90ppi_0.png',
      'https://gadget.co.za/wp-content/uploads/2018/11/1YNBTPaCNBNWLoT7XAbJ1Lw.png',
      'https://imgs.xkcd.com/comics/christmas_eve_eve.png',
      'https://imgs.xkcd.com/comics/phone_alarm.png'
    ]
    let saveToCloudinary = async (urlArray) => {
      let promises = []
      for (const url of urlArray) {
        let result = await save.product(url, 'testFolder')
        promises.push(result.secure_url)
      }
      return Promise.all(promises)
    }
    let save__ = await saveToCloudinary(urlarray)
    expect(() => save__).to.not.throw()
    expect(save__).to.be.a('array')
  })
})
