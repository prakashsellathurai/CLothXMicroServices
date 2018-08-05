const OFFICIAL_EMAIL = 'hello@clothx.net'
const OFFICIAL_PASS = 'clothxnet'
const APP_NAME = 'clothX'
const CLOT_WILDCARD = 'user/{userId}/clothes/{clothId}'
const USER_WILDCARD = 'newUser/{newUserId}'
const secret = 'qbjbEmQT64UiHe3FXHR'
const MSG_91_API_KEY = '187762AxiHe71B5b2bf557'
const STORAGE_BUCKET = 'clothxnet.appspot.com'
const SIZE_ARRAY_OBJECT = { 'S': 0, 'M': 1, 'L': 2, 'XL': 3, '2XL': 4, '3XL': 5 }
const CLOUD_FUNCTIONS_ROOT_URL = 'https://us-central1-clothxnet.cloudfunctions.net'
const PASSWORD_RESET_ROOT_URL = `${CLOUD_FUNCTIONS_ROOT_URL}/passwordreset/`
module.exports = {
  OFFICIAL_EMAIL: OFFICIAL_EMAIL,
  OFFICIAL_PASS: OFFICIAL_PASS,
  APP_NAME: APP_NAME,
  CLOTH_WILDCARD: CLOT_WILDCARD,
  USER_WILDCARD: USER_WILDCARD,
  SECRET_TOKEN: secret,
  MSG_91_API_KEY: MSG_91_API_KEY,
  STORAGE_BUCKET: STORAGE_BUCKET,
  SIZE_ARRAY_OBJECT: SIZE_ARRAY_OBJECT,
  CLOUD_FUNCTIONS_ROOT_URL: CLOUD_FUNCTIONS_ROOT_URL,
  PASSWORD_RESET_ROOT_URL: PASSWORD_RESET_ROOT_URL
}
