//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
module.exports = functions
  .storage
  .object()
  .onFinalize((object) => {
    const fileBucket = object.bucket // The Storage bucket that contains the file.
    const filePath = object.name // File path in the bucket.
    const contentType = object.contentType // File content type.
    const metageneration = object.metageneration // Number of times metadata has been generated. New objects have a value of 1.    
  
  })
