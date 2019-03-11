module.exports = {
  APP_NAME: 'CLOTHX',
  SECRET_TOKEN: $SECRET_TOKEN,
  MSG_91_API_KEY: $MSG_91_API_KEY,
  GET_SIGNED_URL_SETTINGS: {
    action: 'read',
    expires: '03-09-2491'
  },
  FIRESTORE_SETTINGS: {timestampsInSnapshots: true},
  ALGOLIA: {
    test: {
      appId: $appId,
      adminApiKey: $adminApiKey,
      SEARCH_ONLY_API_KEY: $SEARCH_ONLY_API_KEY
    },
    production: {
      appId: appId,
      adminApiKey: $adminApiKey,
      SEARCH_ONLY_API_KEY: $SEARCH_ONLY_API_KEY
    }},
  RAZOR_PAY: {
    KEY_ID: $KEY_ID,
    KEY_SECRET: $KEY_SECRET
  },
    OMNI_CHANNEL_INTEGRATION: {
    FLIKART: {
      AUTH_API_URL: 'https://api.flipkart.net/oauth-service/oauth/token',
      Seller_APIs_Developer_Admin_LOGIN_URL: 'https://api.flipkart.net/oauth-register/login',
      FLIPKART_SELLER_API_BASE_URL: 'https://api.flipkart.net/sellers'
    }
  },

  CLOUDINARY: {
    prod: {
      cloud_name: $cloud_name,
      api_key: $api_key,
      api_secret: $api_secret
    },
    test: {
      cloud_name: $cloud_name,
      api_key: $api_key,
      api_secret: $api_secret
    }
  }
}
