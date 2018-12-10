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
  describe('#responses based on filter', () => {
    let PossibleInputs = [
      {
        description: 'with empty filter object',
        filters: {}
      }, {
        description: 'with empty filter string',
        filters: ''
      },
      {
        description: 'with categories object',
        filters: {
          categories: {}
        }
      },

      {
        description: 'with gender with a none value',
        filters: {
          categories: {
            gender: {}
          }
        }
      },
      {
        description: 'with gender with  a value',
        filters: {
          categories: {
            gender: 'male'
          }
        }
      },
      {
        description: 'with size',
        filters: {
          categories: {
            gender: 'male'
          },
          size: 6
        }
      },
      {
        description: 'with min price value',
        filters: {
          categories: {
            gender: 'male'
          },
          size: 6,
          price: {
            min: 6
          }
        }
      },
      {
        description: 'with max price value',
        filters: {
          categories: {
            gender: 'male'
          },
          size: 6,
          price: { max: 565664
          }}
      },
      {
        description: 'with both max and min price value',
        filters: {
          categories: {
            gender: 'male'
          },
          size: '6',
          price: { max: '565664',
            min: '56'
          }}
      }
    ]

    PossibleInputs.forEach(function (inputObject) {
      it(`${inputObject.description}`, (done) => {
        let body = {
          query: 'black',
          page: 1,
          sortBy: '',
          filters: inputObject.filters
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
  describe('#response with required number of results', () => {
    it('should respond with 20 results', async () => {
      let body = {
        query: '',
        page: 1,
        sortBy: '',
        filters: {}
      }

      let res = await request
        .post('/product')
        .send(body)
      res.body.should.be.an('array')
      res.body.should.have.length(20)
    })
    it('should respond with 20 results on less producst', async () => {
      let body = {
        query: 'black',
        page: 1,
        sortBy: '',
        filters: {}
      }

      let res = await request
        .post('/product')
        .send(body)
      res.body.should.be.an('array')
      res.body.should.have.length(20)
    })
  })
  afterEach(function () {
    request.close()
  })
})
