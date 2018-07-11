'use strict'

// [START import]
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const spawn = require('child-process-promise').spawn
const path = require('path')
const os = require('os')
const fs = require('fs')

module.exports = functions.storage.object().onFinalize((object) => {
  const FilePath = object.name
})
