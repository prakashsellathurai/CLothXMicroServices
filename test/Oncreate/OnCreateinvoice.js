var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})

// test data for DI
var firestore = admin.firestore()
function OncreateInvoice (sid, soldClothesData) {
  let crnArray = soldClothesData.crn
  let quantityArray = soldClothesData.quantity
  let sizeArray = soldClothesData.size
  console.log('syoreId' + sid + '\n' + 'crnArray' + crnArray + '\n' + 'sizeArray' + sizeArray + '\n' + 'quantityArray' + quantityArray)

  return CrawlTheDAtaArray(sid, crnArray, quantityArray, sizeArray)
}
function CrawlTheDAtaArray (sid, crnArray, quantityArray, sizeArray) {
  let promises = []
  for (let index = 0; index < crnArray.length; index++) {
    console.log('for loop index = ' + index)

    promises.push(FindclothWithCRn(sid, crnArray[index]).then(clothesDoc => {
      console.log('for loop after index = ' + index)
      let ClothDocDAta = clothesDoc.data()
      let quantityToReduce = quantityArray[index]
      let intialSizeArray = ClothDocDAta.size
      let intialSize = ClothDocDAta.size[`${sizeArray[index]}`]
      console.log(ClothDocDAta.size[`${sizeArray[index]}`])
      let reducedSize = intialSize - quantityToReduce
      console.log(reducedSize)
      return (checkReducedSizeINtegrity(reducedSize)) ? console.error('size tried to reduce less than 0') : reduceStock(sid, clothesDoc.id, reducedSize, intialSizeArray, sizeArray[index])
    }))
  }
  console.log('end Of FOR LOOP')
  return Promise.all(promises).then(() => console.log('success'))
}

function reduceStock (storeId, clothId, reducedSize, intialSizeArray, sizeArrayElement) {
  console.log(`${clothId} having ${intialSizeArray} is reduced to ${reducedSize}`)
  let update = {}
  update[`size.${sizeArrayElement}`] = reducedSize
  console.log(`reduced Size is updateObject is `)
  console.log(`{size : ${update.size} }`)

  return new Promise(resolve => {
    GetClothDoc(storeId, clothId).update(update)
    console.log('=======================================END OF OPERATION +++++++++++++++++++')
    resolve()
  })
}
function GetClothDoc (storeId, clothId) {
  return firestore.collection(`stores/${storeId}/clothes`).doc(`${clothId}`)
}
function GetClothCollection (storeId) {
  return firestore.collection(`stores/${storeId}/clothes`).get()
}
function FindclothWithCRn (storeId, crn) {
  return GetClothCollection(storeId).then(val => {
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
CrawlTheDAtaArray(1000, [3, 3 ], [ 1, 2], ['XL', 'L'])
