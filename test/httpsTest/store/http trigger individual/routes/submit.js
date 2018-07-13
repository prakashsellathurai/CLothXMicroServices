var express = require('express')
var router = express.Router()
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
router.post('/', function (req, res, next) {
  console.log(req.body);
  console.log(req.files);
})

module.exports = router
