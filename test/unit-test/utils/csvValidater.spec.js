var spectrum = require('csv-spectrum')

var describe = require('mocha').describe
var it = require('mocha').it
var assert = require('chai').assert

var detect = require('./../../../functions/shared/utils/csv/').validateCSV

describe('csv-validator', function () {
  it('detect csvs from csv-spectrum (and reject jsons)', function () {
    spectrum(function (err, data) {
      if (err) throw err
      data.forEach(function (datum) {
        assert.ok(detect(datum.csv), 'csv ' + datum.name)
        assert.notOk(detect(datum.json), 'json ' + datum.name)
      })
    })
  })

  it('detect delimiters', function () {
    var d
    d = detect('a,b,c\n1,2,3') || {}
    assert.equal(d, true)

    d = detect('a;b;c\n\r1;2;3') || {}
    assert.equal(d, true)

    d = detect('"a,,,,,,,,,"\tb\tc\n1\t2\t3') || {}
    assert.equal(d, true)
  })

  it('detect newlines', function () {
    var d
    d = detect('a,b,c\n1,2,3\n') || {}
    assert.equal(d, true)

    d = detect('a,b,c\r1,2,3\r') || {}
    assert.equal(d, true)
  })

  it('one column with quotes', function () {
    var d
    d = detect('"hello"\n"test"') || {}
    assert.equal(d, true)

    d = detect('"hello ""you"""\n"hi"') || {}
    assert.equal(d, true)

    d = detect('hello\nhello')
    assert.equal(d, false)
    assert.notOk(d, 'not quoted')

    d = detect('"hello""\n"hello""')
    assert.equal(d, false)
    assert.notOk(d, 'wrong quotes')
  })
})
