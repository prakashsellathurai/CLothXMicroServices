const db = require('./unit-test/db/db.spec')
const algolia = require('./unit-test/algolia/algolia.spec')
const cloudinary = require('./unit-test/cloudinary/init.spec')
const search = require('./unit-test/HTTPS/algolia/search.spec')
const csv = require('./unit-test/utils/index.spec')
module.exports = {
  db: db,
  algolia: algolia,
  cloudinary: cloudinary,
  search: search,
  csv: csv
}
