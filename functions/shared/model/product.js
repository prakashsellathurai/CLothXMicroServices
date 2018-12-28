'use strict'
const db = require('./../firestore/CRUD/index')
module.exports = class product {
  constructor (data) {
    this.productUid = data.productUid
    this.gender = data.gender
    this.brandName = data.brandName
    this.productName = data.productName
    this.categories = data.categories
    this.description = data.description
    this.variants = (data.variants) ? data.variants : []
    this.addedBy = data.addedBy
    this.storeId = data.storeId
    this.tags = data.tags
    this.taxType = data.taxType
    this.hsnCode = data.hsnCode
    this.otherTax = data.otherTax
    this.inclusiveAllTaxes = data.inclusiveAllTaxes
    this.isVariantsWithSamePrice = data.isVariantsWithSamePrice
    this.hasNoGstNumber = data.hasNoGstNumber
  }
  async save () {
    return db.create.product(this.details)
  }
  delete () {
    return db.delete.product(this.productUid)
  }
  addVariantByProperty (size, stock, purchasedPrice, sellingPrice) {
    let obj = {
      size: size,
      stock: stock,
      purchasedPrice: purchasedPrice,
      sellingPrice: sellingPrice
    }
    this.variants.push(obj)
  }
  set addVariantByObj (obj) {
    this.variants.push(obj)
  }
  get details () {
    return {
      'productUid' : returnIfDefined(this.productUid),
      'brandName': returnIfDefined(this.brandName),
      'productName': returnIfDefined(this.productName),
      'description': returnIfDefined(this.description),
      'categories': returnIfDefined(this.categories),
      'gender': returnIfDefined(this.gender),
      'isVariantsWithSamePrice': returnIfDefined(this.isVariantsWithSamePrice),
      'variants': returnIfDefined(this.variants),
      'picturesPath': returnIfDefined(this.picturesPath),
      'picturesUrl': returnIfDefined(this.picturesUrl),
      'tags': returnIfDefined(this.tags),
      'hasNoGstNumber': returnIfDefined(this.hasNoGstNumber),
      'taxType': returnIfDefined(this.taxType),
      'otherTax': returnIfDefined(this.otherTax),
      'hsnCode': returnIfDefined(this.hsnCode),
      'inclusiveAllTaxes': returnIfDefined(this.inclusiveAllTaxes),
      'addedBy': returnIfDefined(this.addedBy),
      'storeId': returnIfDefined(this.storeId),
      'createdOn': Date.now(),
      'isListable': returnIfDefined(this.isListable),
      'isDeleted': false
    }
  }
}
function returnIfDefined (param) {
  return (param) || ''
}
