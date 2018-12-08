let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./searchTest')
let should = chai.should()
let expect = chai.expect
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
  describe('#should return error on possible unwanted query value in body', (done) => {
    let possibleQueryValues = [null, undefined, {}, [], {halt: 'jjj'}, ['a', 'b', 'c', 'c']]

    possibleQueryValues.forEach((value) => {
      it('should return error on ' + `${value}` + ' query property in body', (done) => {
        let body = {
          query: value
        }
        request
          .post('/product')
          .send(body)
          .end((_err, res) => {
            assert.deepEqual(res.body, errorResponseObjects.PARAM_IS_UNDEFINED('query'), 'query param should not be undefined')
            done()
          })
      })
    })
  })
  it('should return products on query proprety in body', (done) => {
    let body = {
      query: 'black'
    }
    request
      .post('/product')
      .send(body)
      .end((_err, res) => {
        res.body.should.be.an('array')
        done()
      })
  })
  it('should return products with both query and pagination enabled', (done) => {
    let body = {
      query: 'black',
      page: 1
    }
    request
      .post('/product')
      .send(body)
      .end((_err, res) => {
        res.body.should.be.an('array')
        done()
      })
  })

  describe('#resonds with result for various sortby strings', () => {
    let sortByPossibilities = ['high2low', 'low2high', 'newest', '', undefined, null]
    sortByPossibilities.forEach(function (sortByString) {
      it(`should respond on ${sortByString} as sortby in body`, (done) => {
        let body = {
          query: 'black',
          page: 1,
          sortBy: `${sortByString}`
        }
        request
          .post('/product')
          .send(body)
          .end((_err, res) => {
            res.body.should.be.an('array')
            done()
          })
      })
    })
  })
  it('should respond on request without filter', () => {
      
  })

  afterEach(function () {
    request.close()
  })
})
