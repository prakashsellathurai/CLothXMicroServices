//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/invoices/{invoiceId}')
  .onCreate((snap, context) => {
    const storeId = context.params.storeId
    const soldClothsData = snap.data().soldClothes
    const crnArray = soldClothsData.crn
    const sizeArray = soldClothsData.size
    const quantityArray = soldClothsData.quantity
    console.log('syoreId' + storeId + '\n' + 'crnArray' + crnArray + '\n' + 'sizeArray' + sizeArray + '\n' + 'quantityArray' + quantityArray)
    return UpDateTheSizeArray(storeId, crnArray, quantityArray, sizeArray)
  })

function UpDateTheSizeArray (sid, crnArray, quantityArray, sizeArray) {
  let promises = []
  for (let index = 0; index < crnArray.length; index++) {
    console.log('for loop index = ' + index)
    promises.push(FindclothWithCRn(sid, crnArray[index]).then(clothesDoc => {
      console.log('for loop after index = ' + index)
      let ClothDocDAta = clothesDoc.data()
      let quantityToReduce = quantityArray[index]
      let intialSize = ClothDocDAta.size[`${sizeArray[index]}`]
      let reducedSize = intialSize - quantityToReduce
      console.log(reducedSize)
      return (checkReducedSizeINtegrity(reducedSize)) ? console.error('size tried to reduce less than 0') : reduceStock(sid, clothesDoc.id, reducedSize, sizeArray[index])
    }))
  }
  console.log('end Of FOR LOOP')
  return Promise.all(promises).then(() => console.log('success'))
}
function reduceStock (storeId, clothId, reducedSize, sizeArrayElement) {
  let update = {}
  update[`size.${sizeArrayElement}`] = reducedSize
  console.log(`reduced Size is updateObject is `)
  console.log(`{size : ${update.size} }`)

  return new Promise(resolve => {
    dbFun.GetClothDoc(storeId, clothId).update(update)
    console.log('=======================================END OF OPERATION +++++++++++++++++++')
    resolve()
  })
}

function FindclothWithCRn (storeId, crn) {
  return dbFun.GetClothCollection(storeId).then(val => {
    return new Promise((resolve, reject) => {
      val.docs.forEach(val => {
        if (val.data().crn === crn) {
          return resolve(val)
        }
      })
    })
  })
}
function checkReducedSizeINtegrity (reducedSize) {
  return reducedSize < 0 || isNaN(reducedSize) || reducedSize === undefined || reducedSize === null
}
