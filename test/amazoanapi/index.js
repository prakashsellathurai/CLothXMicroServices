'use strict'
const CONSTANTS = require('../../functions/shared/environment/CONSTANTS')
const ACCESS_KEY_ID = CONSTANTS.CREDENTIALS_FOR_TESTING.AWS_ACCESS_KEY_ID
const ACCESS_SECRET_KEY = CONSTANTS.CREDENTIALS_FOR_TESTING.AWS_SECRET_ACCESS_KEY
const DEVELOPER_ID = CONSTANTS.CREDENTIALS_FOR_TESTING.AWS_DEV_ID
const MWSClient = require('./mws-api-master/index')
const mws = new MWSClient({
    
})