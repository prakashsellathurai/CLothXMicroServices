let cloudinaryClient = require('./../../../environment/initCloudinary').withCredentials()
const product = (url) => cloudinaryClient
  .v2
  .uploader
  .upload(
    url,
    {
      folder: 'products',
      use_filename: true
    }
    , function (err, result) {
      if (err) console.error(err)
      else {
        return result
      }
    })
module.exports = {
  product: product
}
