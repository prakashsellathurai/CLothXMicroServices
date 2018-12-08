let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./searchTest')
let should = chai.should()
let assert = chai.assert
chai.use(chaiHttp)
let errorResponseObjects = require('./../../../../functions/shared/utils/integrations/algolia/router/shared/error_response_objects')
describe('/Get product', () => {
  let request

  beforeEach(() => {
    request = chai.request(server)
  })

  it('should respond with status 400', (done) => {
    request
      .get('/product')
      .end((_err, res) => {
        res.should.have.status(400)
        done()
      })
  })
  it('should respond with error message', (done) => {
    request
      .get('/product')
      .end((_err, res) => {
        assert.deepEqual(res.body, errorResponseObjects.GET_METHOD_NOT_SUPPORTED, 'response should be equal to resonse object')

        done()
      })
  })
  afterEach(function () {
    request.close()
  })
})
describe('/POST product', () => {
  let request
  beforeEach(() => {
    request = chai.request(server)
  })
  it('should return error on undefined query property in body', (done) => {
    let body = {
    }
    request
      .post('/product')
      .send(body)
      .end((_err, res) => {
        assert.deepEqual(res.body, errorResponseObjects.PARAM_IS_UNDEFINED('query'), 'query param should be undefined')
        done()
      })
  })
  
  afterEach(function () {
    request.close()
  })
})
