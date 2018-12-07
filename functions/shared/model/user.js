'use strict'
const db = require('./../firestore/CRUD/index')
const Store = require('./store')
module.exports = class user {
  constructor (data) {
    this.email = data['email']
    this.uid = data['uid']
    this.displayName = data['displayName']
    this.photoUrl = data['photoUrl']
    this.token = data['token']
    // conditional data
    this.isRegister = data['isRegister'] ? data['isRegister'] : null
    this.registerOf = data['registerOf'] ? data['registerOf'] : []
    this.isEmployee = data['isEmployee'] ? data['isEmployee'] : null
    this.employeeOf = data['employeeOf'] ? data['employeeOf'] : null
    this.createdOn = data['createdOn'] ? data['createdOn'] : null
    this.createdBy = data['createdBy'] ? data['createdBy'] : null
    this.role = data['role'] ? data['role'] : null
  }
  save () {
    return db.create.user(this.details)
  }
  async registerTheStore (storeDetails) {
    try {
      let store = new Store(storeDetails)
      let registeredId = await store.save()
      this.isRegister = true
      this.registerOf.push(registeredId)
      this.role = 'Register'
      return store.details
    } catch (e) {
      console.error(e)
    }
  }
  delete () {
    return db.delete.user(this.email)
  }
  get details () {
    return {
      email: (this.email) ? this.email : '',
      uid: (this.uid) ? this.uid : '',
      displayName: (this.displayName) ? this.displayName : '',
      photoUrl: (this.photoUrl) ? this.photoUrl : '',
      token: (this.token) ? this.token : '',
      isRegister: (this.isRegister) ? this.isRegister : '',
      registerOf: (this.registerOf) ? this.registerOf : '',
      isEmployee: (this.isEmployee) ? this.isEmployee : '',
      employeeOf: (this.employeeOf) ? this.employeeOf : '',
      createdOn: (this.createdOn) ? this.createdOn : '',
      createdBy: (this.createdBy) ? this.createdBy : '',
      role: (this.role) ? this.role : ''
    }
  }
}
