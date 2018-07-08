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
  for (let index = 0; index <= crnArray.length; index++) {
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
      if (reducedSize < 0) {
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
    firestore.collection(`stores/${storeId}/clothes`).doc(`${clothId}`).update(update)
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
CrawlTheDAtaArray(1000, [1, 1, 2, 3], [1, 2, 3, 4], ['XL', 'M', 'L', 'S'])
