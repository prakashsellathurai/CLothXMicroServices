let initindex = require('./../../../functions/shared/utils/integrations/algolia/index').initIndex
let productIndex = initindex.product.unsorted

const RESULTS_PER_PAGE = 20
function MAP_ALGOLIA_DATA_BACK_FIRESTORE (data) {

}
function arrayFromObject (obj) {
  var arr = []
  for (var i in obj) {
    arr.push(obj[i])
  }
  return arr
}

function optimalArrayLength (array) {
  return (array.length) === RESULTS_PER_PAGE
}
function lessThanOptimalArrayLength (array) {
  return array.length < RESULTS_PER_PAGE
}
function moreThanOptimalArrayLength (array) {
  return array.length > RESULTS_PER_PAGE
}


function groupBy (list, fn) {
  var groups = {}
  for (var i = 0; i < list.length; i++) {
    var group = JSON.stringify(fn(list[i]))
    if (group in groups) {
      groups[group].push(list[i])
    } else {
      groups[group] = [list[i]]
    }
  }
  return arrayFromObject(groups)
}
function makeReqByOffsetAndLength (query,  filters, offset, length) {
  return productIndex
  .search(
    {
      query: query,
      filters: filters,
       offset: offset,
       length: length
     
    }
  ).then((content) => content.hits)
}
function makeReqBypage (query, filters, page) {
  return productIndex
  .search(
    {
      query: query,
      filters: filters,
      page: page,
      hitsPerPage: RESULTS_PER_PAGE
     
    }
  ).then((content) => content.hits) 
}
function mainThread (query, filters, page) {
return makeReqBypage(query, filters, page)
.then(hits => {
  let groupedhits =  groupBy(hits,(product) => [product.productUid])
  let offset = RESULTS_PER_PAGE*page - 1
  let length = (RESULTS_PER_PAGE > groupedhits.length) ? RESULTS_PER_PAGE - groupedhits.length : (RESULTS_PER_PAGE < groupedhits.length) ? groupedhits.length - RESULTS_PER_PAGE : groupedhits.length
 console.log(offset, length,  hits.length, groupedhits.length)
  return recursiveCall(query, filters, hits, offset, length)
})
.then((hits) => hits)
}
function normalizeTheobjects (sortedDataArray) {

}
function recursiveCall (query, filters, hits ,offset, length) {
  let groupedhits =  groupBy(hits,(product) => [product.productUid])
  console.log(offset, length,  hits.length, groupedhits.length)
  if (optimalArrayLength(groupedhits)) {
     return groupedhits
  } else {
     return  makeReqByOffsetAndLength(query,filters,offset, length)
    .then((morehits) => {
      console.log('more hits' + morehits.length)
    let updatedHits = hits.concat(morehits)
     console.log('hits' + updatedHits.length)
    // let groupedhits =  groupBy(hits,(product) => [product.prn])
   //  let length = (RESULTS_PER_PAGE > groupedhits.length) ? RESULTS_PER_PAGE - groupedhits.length : (RESULTS_PER_PAGE < groupedhits.length) ? groupedhits.length - RESULTS_PER_PAGE : groupedhits.length
   // console.log(hits.length, groupedhits.length)
       return recursiveCall(query,filters, updatedHits, offset, length + 1)
    } )
    

  }
}
function countObjkeys (obj) {
  return Object.keys(obj).length
}
mainThread('black', 'isListable:true AND isDeleted:false',1)
//.then(val=> console.log(val.length))