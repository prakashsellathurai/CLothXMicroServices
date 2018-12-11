const db = require('./UNITTEST/db/db.spec')
const algoliaSearch = require('./UNITTEST/HTTPS/algolia/search.spec')
module.exports = {
  db: db,
  algoliaSearch: algoliaSearch
}
