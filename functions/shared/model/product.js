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
  get save () {
    return db.create.product(this.details())
  }
  get delete () {
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
      'brandName': this.brandName,
      'productName': this.productName,
      'description': this.description,
      'categories': this.categories,
      'gender': this.gender,
      'isVariantsWithSamePrice': this.isVariantsWithSamePrice,
      'variants': this.variants,
      'picturesPath': this.picturesPath,
      'picturesUrl': this.picturesUrl,
      'tags': this.tags,
      'hasNoGstNumber': this.hasNoGstNumber,
      'taxType': this.taxType,
      'otherTax': this.otherTax,
      'hsnCode': this.hsnCode,
      'inclusiveAllTaxes': this.inclusiveAllTaxes,
      'addedBy': this.addedBy,
      'storeId': this.storeId,
      'createdOn': Date.now(),
      'isListable': this.isListable,
      'isDeleted': false
    }
  }
}
