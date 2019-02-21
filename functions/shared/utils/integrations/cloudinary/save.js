let cloudinaryClient = require('./../../../environment/initCloudinary').withCredentials()
const _ = require('lodash')
const product = (url, productId) => {
  if (_.isEmpty(url) || _.isUndefined(url)) {
    return Promise.resolve(0)
  } else {
    return cloudinaryClient
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
  }
}

const store = {
  logo: (url, storeId) => cloudinaryClient
    .v2
    .uploader
    .upload(
      url,
      {
        folder: `store/${storeId}/logo`,
        use_filename: true
      }
      , function (err, result) {
        if (err) console.error(err)
        else {
          return result
        }
      }),

  Pictures: (url, storeId) => cloudinaryClient
    .v2
    .uploader
    .upload(
      url,
      {
        folder: `store/${storeId}/pictures`,
        use_filename: true
      }
      , function (err, result) {
        if (err) console.error(err)
        else {
          return result
        }
      })
}
module.exports = {
  product: product,
  store: store
}
