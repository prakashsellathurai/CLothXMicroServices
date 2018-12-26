let cloudinaryClient = require('./../../../environment/initCloudinary').withCredentials()
const product = (url, productId) => cloudinaryClient
  .v2
  .uploader
  .upload(
    url,
    {
      folder: `products/${productId}`,
      use_filename: true
    }
    , function (err, result) {
      if (err) console.error(err)
      else {
        return result
      }
    })
const store = (url, storeId) => cloudinaryClient
  .v2
  .uploader
  .upload(
    url,
    {
      folder: `store/${storeId}`,
      use_filename: true
    }
    , function (err, result) {
      if (err) console.error(err)
      else {
        return result
      }
    })
module.exports = {
  product: product,
  store: store
}
