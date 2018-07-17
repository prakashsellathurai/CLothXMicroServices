function MapStoreLog (sid, storelog) {
  storelog = structureTheobject(sid, storelog)
  return RemoveUndefinedValues(storeModel(sid, storelog))
}
function storeModel (sid, storelog) {
  return {
    sid: sid,
    storeName: storelog.storename,
    email: storelog.email,
    ownerName: storelog.ownername,
    ownerMobileNo: storelog.ownermobileno,
    propriatorName: storelog.proprietorname,
    storeType: storelog.storetype,
    address: storelog.address,
    district: storelog.district,
    state: storelog.state,
    country: storelog.country,
    zip: storelog.zip,
    panNo: storelog.panno,
    numberOfBranches: storelog.numberofbranches,
    shopContactNo: storelog.shopcontactno,
    monthlyRevenue: storelog.monthlyrevenue,
    noOfWorkers: storelog.noofworkers,
    noOfUsersRequired: storelog.noofusersrequired,
    uploads: { images: storelog.images, logo: storelog.logo },
    coordinates: {
      accuracy: storelog.accuracy,
      geoPoint: storelog.geopoint
    },
    createdAt: new Date()
  }
}
function structureTheobject (sid, obj) {
  for (var key in obj) {
    obj[key] = writeItORNullStringIt(obj[key])
    if ((key === 'images' || key === 'logo') && Array.isArray(obj[key])) {
      let arr = obj[key]
      for (let index = 0; index < arr.length; index++) {
        arr[index] = `stores/${sid}/${key}/${arr[index]}`
      }
    }
  }
  return obj
}
function writeItORNullStringIt (el) {
  return el || ''
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}
module.exports = {
  MapStoreLog: MapStoreLog
}
