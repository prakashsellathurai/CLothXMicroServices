let chai = require('chai')
let chaiHttp = require('chai-http')
chai.use(chaiHttp)
describe('create listings test', function () {
  it('should return status 200 ok on success', (done) => {
    let body = {

    }
    chai.request()
      .post('/createlisting')
      .send(body)
      .end((err, res) => {
        if (err) done(err)
        else {
          res.should.have.status(200)
          res.should.have.a('object')
          res.should.not.have.property('errors')
          done()
        }
      })
  })
})
