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
          }
        }
      },
      {
        description: 'with custom input',
        query: 't shirt',
        filters: {
          allowOutOfStock: false,
          categories: {
            gender: 'male'
          },
          location: 'coimbatore',
          size: '',
          price: {
            inMin: 0,
            inMax: 1000,
            min: 0,
            max: 1000
          },
          sortBy: 'high2low',
          page: 0
        }
      },
      {
        description: 'with single quote',
        query: '',
        filters: {
          allowOutOfStock: '',
          categories: {
            gender: ''
          },
          location: '',
          size: '',
          price: {
            inMin: '',
            inMax: '',
            min: '',
            max: ''
          },
          sortBy: '',
          page: 1
        }
      }, {
        description: 'with proper values',
        query: 'black',
        filters: {
          allowOutOfStock: false,
          categories: {
            gender: 'male'
          },
          location: 'coimbatore',
          size: 5,
          price: {
            inMin: 0,
            inMax: 1000,
            min: 0,
            max: 500
          },
          sortBy: '',
          page: 1
        }
      },
      {
        description: 'with gender',
        query: 'black',
        filters: {
          allowOutOfStock: false,
          categories: {
            gender: 'male'
          },
          location: 'coimbatore',
          size: 5,
          price: {
            inMin: 0,
            inMax: 1000,
            min: 0,
            max: 500
          },
          sortBy: '',
          page: 1
        }
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
            res.should.not.have.property('status', 500)
            done()
          })
      })
    })
  })
  describe('#response structure test', () => {
    it(`should respond with firestore data structure`, (done) => {
      let body = {
        query: '',
        page: 1,
        sortBy: ''
      }
      request
        .post('/product')
        .send(body)
        .end((_err, res) => {
          res.body.should.be.an('array')
          let firebaseProducts = []
          res.body.forEach((product) => firebaseProducts.push(product))
          firebaseProducts.forEach(product => {
            expect(product).to.contain.keys('picturesUrl',
              'categories',
              'hsnCode',
              'inclusiveAllTaxes',
              'picturesPath',
              'productUid',
              'description',
              'gender',
              'hasNoGstNumber',
              'otherTax',
              'productName',
              'storeId',
              'prn',
              'createdOn',
              'storeDetails',
              'tags',
              'addedBy',
              'taxType',
              'isListable',
              'isDeleted',
              'brandName',
              'isVariantsWithSamePrice',
              'variants')
          })

          done()
        })
    })
    let genders = ['male', 'female']
    genders.forEach(gender => {
      it(`respond with ${gender}`, (done) => {
        let body = {
          query: 'black',
          filters: {
            allowOutOfStock: false,
            categories: {
              gender: gender
            },
            size: 'g'
          }
        }
        request
          .post('/product')
          .send(body)
          .end((_err, res) => {
            let firebaseProducts = []
            res.body.forEach((product) => firebaseProducts.push(product))
            //   console.log(res.body.length)
            firebaseProducts.forEach(product => {
              expect(product).to.have.property('gender', gender)
            })
            done()
          })
      })
    })
  })
  afterEach(function () {
    request.close()
  })
})
