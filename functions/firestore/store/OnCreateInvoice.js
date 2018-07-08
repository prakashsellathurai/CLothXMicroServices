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
      let SizeIndexToBeupdated = MApSizeArray(sizeArray[index])
      let quantityToReduce = quantityArray[index]
      let intialSizeArray = ClothDocDAta.size
      let intialSize = ClothDocDAta.size[SizeIndexToBeupdated]
      let reducedSize = intialSize - quantityToReduce
      console.log(reducedSize)
      if (reducedSize < 0 || isNaN(reducedSize) || reducedSize === undefined || reducedSize === null) {
        console.error('size tried to reduce less than 0')
      } else {
        reduceStock(sid, clothesDoc.id, SizeIndexToBeupdated, reducedSize, intialSizeArray, sizeArray[index])
      }
    }))
  }
  console.log('end Of FOR LOOP')
  return Promise.all(promises).then(() => console.log('success'))
}
function reduceStock (storeId, clothId, SizeIndexToBeupdated, reducedSize, intialSizeArray, sizeArrayElement) {
  console.log(`${clothId} having ${intialSizeArray} having index ${SizeIndexToBeupdated} value = ${intialSizeArray[SizeIndexToBeupdated]} is reduced to ${reducedSize}`)
  intialSizeArray[SizeIndexToBeupdated] = reducedSize
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
        if (val.data().crn === crn) {
          return resolve(val)
        }
      })
    })
  })
}
