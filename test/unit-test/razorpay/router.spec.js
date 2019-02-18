const chai = require('chai')
let chaiHttp = require('chai-http')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
chai.use(chaiHttp)

var expect = chai.expect
let assert = chai.assert

let server = require('./router.testServer')

describe('/Get paymentGateway ', () => {
  let request

  beforeEach(() => {
    request = chai.request(server)
  })
  it('should respond with static page status 200', () => {
      request
      .get('/paymentGateway')
      .end((_err                                                                                                                                                                                                                                                                                                                                                                                                                                                          ))
  })
  afterEach(function () {
    request.close()
  })
})
