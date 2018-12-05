'use strict'

function filterVariantInProduct (data) {
  let obj = data
  delete obj['variants']
  return obj
}
function DeNormalizeTheProductData (filteredObject, variant) {
  let DenormedData = filteredObject
  for (var k in variant) { DenormedData[k] = variant[k] }
  return DenormedData
}
function extractVariantInProduct (data) {
  return data.variants
}
function convertToUnixtimestamp (date) {
  return Math.floor((new Date()).getTime() / 1000)
}

function dataPreprocessor (data) {
  let isVariantsWithSamePrice = data.isVariantsWithSamePrice
  data.createdOn = convertToUnixtimestamp(data.createdOn)
  if (isVariantsWithSamePrice) {
    let variants = data.variants
    let purchasedPrice
    let sellingPrice
    for (let index = 0; index < variants.length; index++) {
      const variant = variants[index]
      variant.purchasedPrice = Number(variant.purchasedPrice)
      variant.sellingPrice = Number(variant.sellingPrice)
      variant.purchasedPrice = (isNaN(variant.purchasedPrice)) ? 0 : variant.purchasedPrice
      variant.sellingPrice = (isNaN(variant.sellingPrice)) ? 0 : variant.sellingPrice
      if (variant.purchasedPrice > 0) { purchasedPrice = variant.purchasedPrice }
      if (variant.sellingPrice > 0) { sellingPrice = variant.sellingPrice }
    }
    if (typeof sellingPrice !== 'number') {
      sellingPrice = 0
    }
    if (typeof purchasedPrice !== 'number') {
      purchasedPrice = 0
    }
    for (let index = 0; index < data.variants.length; index++) {
      data.variants[index].purchasedPrice = purchasedPrice
      data.variants[index].sellingPrice = sellingPrice
    }
  }
  return data
}

function updateVariantWithObjectId (variant, objectId) {
  variant['objectID'] = objectId
  return Promise.resolve(variant)
}
module.exports = {
  filterVariantInProduct: filterVariantInProduct,
  DeNormalizeTheProductData: DeNormalizeTheProductData,
  extractVariantInProduct: extractVariantInProduct,
  dataPreprocessor: dataPreprocessor,
  updateVariantWithObjectId: updateVariantWithObjectId
}
