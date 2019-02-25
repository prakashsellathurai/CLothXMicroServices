'use strict'
let db = require('./../../firestore/CRUD')
/**
 * REPONSE CODE OBJECT
 * @class RESPONSE_OBJECT
 * @returns {Object} {
 *    statusCode: Status code repreenting the succes data,
 *    error: error status,
 *    error_description: description for th corresponding error
 * }
 */
const RESPONSE_CODES = {
  SUCCESS: {
    statusCode: 200,
    error: null,
    error_description: null
  },
  FAILURE: (error, description) => Object.assign({
    statusCode: 400,
    error: error,
    error_description: description
  })
}
/**
 * returns the RESPONSE CODE @RESPONSE_OBJECT by checking the validity
 * @param {JSON_ARRAY_OF_PRODUCTS} products
 * @async
 * @returns {RESPONSE_CODES.SUCCESS | RESPONSE_CODES.FAILURE}
 */
const checkProductDataValidity = async (products) => {
  for (const i in products) {
    let product = products[i]
    let storeId = product.storeId || false
    let addedBy = product.addedBy || false
    if (!storeId) return RESPONSE_CODES.FAILURE('invalid storeId field', 'check your storeId whether it is provided or not')
    else if (!addedBy) return RESPONSE_CODES.FAILURE('invalid addedBy field', 'check for adddedby and provide the valid one')
    else {
      let storeIdExist = await db.utils.storeIdExists(storeId)
      let uidExist = await db.utils.uidExist(addedBy)
      if (!storeIdExist) return RESPONSE_CODES.FAILURE('storeId not exists', 'provide the registered storeId')
      else if (!uidExist) return RESPONSE_CODES.FAILURE('addedBy field not exists', 'provide the registered uid')
    }
  }
  return RESPONSE_CODES.SUCCESS
}
module.exports = {
  RESPONSE_CODES: RESPONSE_CODES,
  checkProductDataValidity: checkProductDataValidity
}
