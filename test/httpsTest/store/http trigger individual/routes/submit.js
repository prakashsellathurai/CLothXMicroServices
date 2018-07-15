var express = require('express')
var router = express.Router()


router.post('/', function (req, res, next) {
console.log(req.files + req.fields)
res.json({fields: req.fields})
})

module.exports = router
