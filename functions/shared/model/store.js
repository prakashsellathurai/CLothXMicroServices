'use strict'
const db = require('./../firestore/CRUD/index')
module.exports = class store {
  constructor (data) {
    this.storeName = data.storeName
    this.mobileNumber = data.mobileNumber
    // this.contactNumber = data.contactNumber;
    this.address = data.address
    this.gstNumber = data.gstNumber
    this.typeOfStore = data.typeOfStore
    this.hasNoGstNumber = data.hasNoGstNumber
  }
  save () {
    return db
      .create
      .store(this.details)
      .then((docref) => {
        this.registerUid = docref.id
        return this.registerUid
      })
  }
  delete () {
    return db.delete.store(this.registerUid)
  }
  set details (data) {
    this.registerUid = data.registerUid
    this.storeName = data.storeName
    this.mobileNumber = data.mobileNumber
    // contactNumber= data.contactNumber
    this.typeOfStore = data.typeOfStore
    this.gstNumber = data.gstNumber
    this.hasNoGstNumber = data.hasNoGstNumber
    this.address = data.address
    this.location = data.location
    this.locationTimeStamp = data.locationTimeStamp
    this.createdAt = data.createdAt
  }
  get details () {
    return {
      registerUid: (this.registerUid) ? this.registerUid : '',
      storeName: (this.storeName) ? this.storeName : '',
      mobileNumber: (this.mobileNumber) ? this.mobileNumber : '',
      // contactNumber: this.contactNumber,
      typeOfStore: (this.typeOfStore) ? this.typeOfStore : '',
      gstNumber: (this.gstNumber) ? this.gstNumber : '',
      hasNoGstNumber: (this.hasNoGstNumber) ? this.hasNoGstNumber : '',
      address: (this.address) ? this.address : '',
      location: (this.location) ? this.location : '',
      locationTimeStamp: (this.locationTimeStamp) ? this.locationTimeStamp : '',
      createdAt: (this.createdAt) ? this.createdAt : ''
    }
  }
}
