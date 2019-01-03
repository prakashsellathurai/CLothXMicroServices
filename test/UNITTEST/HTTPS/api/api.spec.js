// default test imports
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('./api.mock')
let should = chai.should()
let expect = chai.expect
let assert = chai.assert
// test setup
chai.use(chaiHttp)
