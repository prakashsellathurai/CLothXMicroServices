const db = require('./UNITTEST/db/db.spec')
const algolia = require('./UNITTEST/algolia/algolia.spec')
const cloudinary = require('./UNITTEST/cloudinary/init.spec')
const search = require('./UNITTEST/HTTPS/algolia/search.spec')
module.exports = {
  db: db,
  algolia: algolia,
  cloudinary: cloudinary,
  search: search
}
