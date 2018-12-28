let cloudinaryClient = require('./../../../environment/initCloudinary').withCredentials()

const image = (url, publicId) => cloudinaryClient
  .v2
  .uploader
  .upload(url,
    {
      overwrite: true,
      public_id: publicId
    }
    ,
    function (err, result) {
      if (err) console.error(err)
      else {
        return result
      }
    })
module.exports = {
  image: image
}
