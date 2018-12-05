module.exports = {
  APP_NAME: 'CLOTHX',
  SECRET_TOKEN: 'qbjbEmQT64UiHe3FXHR',
  MSG_91_API_KEY: '187762AxiHe71B5b2bf557',
  GET_SIGNED_URL_SETTINGS: {
    action: 'read',
    expires: '03-09-2491'
  },
  FIRESTORE_SETTINGS: {timestampsInSnapshots: true},
  ALGOLIA: {
    test: {
      appId: 'K5TY9WEM1N',
      adminApiKey: '87a91ddef91e0868d76405c2467122e9',
      SEARCH_ONLY_API_KEY: 'c34f0706878bc2a520600b07f9587757'
    },
    production: {
      appId: 'XYNZX5WQ9A',
      adminApiKey: '3e1e9d17ce08b6941dfa0a06c1adf943',
      SEARCH_ONLY_API_KEY: 'a38933be7a758f30bd0b1681b35fc15b'
    }},
  OMNI_CHANNEL_INTEGRATION: {
    FLIKART: {
      AUTH_API_URL: 'https://api.flipkart.net/oauth-service/oauth/token',
      Seller_APIs_Developer_Admin_LOGIN_URL: 'https://api.flipkart.net/oauth-register/login',
      FLIPKART_SELLER_API_BASE_URL: 'https://api.flipkart.net/sellers'
    }
  },
  RAZOR_PAY: {
    KEY_ID: 'rzp_test_yN3pbgVEDqojtv',
    KEY_SECRET: 'Z1mUElL13QliOwNixNn9MSif'
  }
}
