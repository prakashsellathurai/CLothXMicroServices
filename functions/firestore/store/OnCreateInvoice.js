//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../CRUD/db')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions.firestore
  .document('stores/{storeId}/invoice/{invoiceId}').onCreate((snap, context) => {
    const storeId = context.params.storeId
    // const invoiceId = context.params.invoiceId
    const soldClothsData = snap.data().soldClothes
    const crnArray = soldClothsData.crn
    const sizeArray = soldClothsData.size
    const quantityArray = soldClothsData.quantity
    return UpDateTheSizeArray(storeId, crnArray, sizeArray, quantityArray)
  })

function UpDateTheSizeArray (sid, crnArray, sizeArray, quantityArray) {
  for (let index = 0; index < crnArray.length; index++) {
    return FindclothWithCRn(sid, crnArray[index]).then(clothesDoc => {
      let ClothDocDAta = clothesDoc.data()
      let SizeIndexToBeupdated = MApSizeArray(sizeArray[index])
      let quantityToReduce = quantityArray[index]
      let intialSizeArray = ClothDocDAta.size
      let intialSize = ClothDocDAta.size[SizeIndexToBeupdated]
      let reducedSize = intialSize - quantityToReduce
      if (reducedSize < 0) {
        console.error('size tried to reduce less than 0')
        return 0
      } else {
        return reduceStock(sid, clothesDoc.id, SizeIndexToBeupdated, reducedSize, intialSizeArray)
      }
    })
  }
}
function reduceStock (storeId, clothId, SizeIndexToBeupdated, reducedSize, intialSizeArray) {
  intialSizeArray[SizeIndexToBeupdated] = reducedSize
  let update = { size: intialSizeArray }
  return dbFun.GetClothDoc(storeId, clothId).update(update)
}

function MApSizeArray (sizeArrayElement) { // S,M,L,XL,2XL,3XL
  switch (sizeArrayElement) {
    case 'S' : return 0
    case 'M' : return 1
    case 'L' : return 2
    case 'XL' : return 3
    case '2XL': return 4
    case '3Xl' : return 5
  }
}

function FindclothWithCRn (storeId, crn) {
  return dbFun.GetClothCollection(storeId).then(val => {
    return new Promise((resolve, reject) => {
      val.docs.forEach(val => {
        if (val.data().crn === crn) return resolve(val)
      })
    })
  })
}
