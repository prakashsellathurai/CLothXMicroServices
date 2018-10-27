const env = require('./../../../environment/env')
const url = require('url')
const BASE_URL = env.OMNI_CHANNEL_INTEGRATION.FLIKART.FLIPKART_SELLER_API_BASE_URL

module.exports = {
  createListing: () => url.resolve(BASE_URL, '/listings/v3'),
  updateListing: () => url.resolve(BASE_URL, '/listings/v3/update'),
  listingViaSKUids: (skuId) => url.resolve(BASE_URL, `/listings/v3/${skuId}`),
  updatelistingPrice: () => url.resolve(BASE_URL, '/listings/v3/update/price'),
  updateinventoryListing: () => url.resolve(BASE_URL, '/listings/v3/update/inventory')
}
