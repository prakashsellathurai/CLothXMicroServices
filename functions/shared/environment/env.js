module.exports = {
  APP_NAME: 'CLOTHX',
  SECRET_TOKEN: 'qbjbEmQT64UiHe3FXHR',
  MSG_91_API_KEY: '187762AxiHe71B5b2bf557',
  GET_SIGNED_URL_SETTINGS: {
    action: 'read',
    expires: '03-09-2491'
  },
  FIRESTORE_SETTINGS: { timestampsInSnapshots: true },
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
    } },
  RAZOR_PAY: {
    KEY_ID: 'rzp_test_yN3pbgVEDqojtv',
    KEY_SECRET: 'Z1mUElL13QliOwNixNn9MSif'
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
      cloud_name: 'spoteasy',
      api_key: '225699151327223',
      api_secret: '-PGISz3YDOADpehEuUTkCI7__No'
    },
    test: {
      cloud_name: 'selfegeg',
      api_key: '133558435818499',
      api_secret: 'pyoe_PbqSoMHmtdEF3nERWG5Cuc'
    }
  },
  testing: {
    local: {
      adminCert: {
        'type': 'service_account',
        'project_id': 'rawdb-f19d8',
        'private_key_id': '3d8962b2299213c02cb25fc88a1539e9b7853e6d',
        'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/maDL03onBO0x\n6/wgzOiPZ3pfVgjJHbUB6vm0YbxroMRzkddBqFMd1s+y1ny4kkwmo/3NeHestDdM\ncADIVD8FG0yviIvIKbRw+hELIKpHU7TvwUFtiovupk1RDbqL4dXmOKLcTtRP8CTo\nqgB3KJMRO8C5MxcT2KRdlY1Nw0uK/1KhFSjwW20WiaSFDz7RkxL7H6fYq/6xWFSN\nFdr8IU7+WhxRIR46n6PIILE7pb4fbmi77hlCJu1WP+YZhN3Jnv9PpIcLcYL6CE4Y\nEOtJYaIrAv9w/jfwL7BMwbiJLr4dzmP36oPwJI7u2Bp8Z2Yqj77VQWAgF7AQdkCl\noRm4ER//AgMBAAECggEAB708Ekxq6FCTbcTLQysdUBpgUwfpBInZDRUuT1Imh9Wc\nM2updwZGW5oyeyLQZUdjh0Jwg6NhRVSYnaAyJ+VfQxfxmdWGIxusJWdOCokGcVy5\nBKyY6MSdfZJLsgGmW1tP7IpOtpKbxaIJm5975u3fCUv3yOmxyoqhrDYL2YXd80tM\nfvYT1AnSs8GQHGzqnEiYoJyk4OWbcKB7/SjWDwfacSXrRiJajDJ0zc9LW0nxvWqi\nT+UblLR8TYltQLEGWWnGa5vy4svDX7+0h9zE1aKcEIUFlb/tciWVqCeP+iiE4sB8\nl7epf7uM92ssFw+52HKcSF6faSrnsRGrl6D82Rl4gQKBgQD4D2jlysxS9bMFlzDr\n2r2U+L7hTCnMdceqgXKsJZFFSkWL/smFNPVmQNN0m+9+z101otkewUmg/csx+l5e\nX6BvZYmxG721cgmj38L4t+E618okEe8VNlep1LZhA4+UFJQlInr7VckKSFWARQJw\nvTNbtwtAh70mscr7+lsaRTJJ8QKBgQDFu5Z8MSijYBjbn3nX1pJ7zblyOhtYi1Xi\nhHqQkA2c/IlEMIf2TzgbnfXHedUEMMaRoA/sUzZ6zQgzVisnrcD+9CpMqGzhsXlW\noWUW7e3JqZxgZx0PzZaX+oSjGH1LJCwmrRqfyyaIdq9xsX5mv/E+ZBmspsBrlj1s\ndq/JZqeY7wKBgGCUP1cYeizilGzczKNHawCRSGAXcz6zrKVp+OelSMYdgK5c6MEA\nOXsySiHghIJu4e98E+SxhKU1quMug4di2+gDNHTMRDRczfwLprGHhh2O3pjkkp1D\npyXsN4XWCRSyXmuG3TL112w1dXSXabfTMifHQI5DSxXBqzIn60hzIH1BAoGBAILa\nMyoYthX4ADtG/DDz1JiNeg23mmUsQDfZB+snCXs8O/KeUzuTDURpcj8BxxAw3xd7\n3027e7AkgyrF+WUWvUN7fYqhYvywn+XOhMF5zwTHc67wTfEpUmFc7e2oxTG2zGkD\n4TyiCewA7vXESivhFdr+D2eMKoaINDnVCVu0zXCNAoGBANcAYFWyywyJ/aKZ9KGl\n2gXJVCSj0OZ11LnVnYC+uSsTa8n4FoYCykqmnuoBM8VFXgIvFQQwt9AJfgMj5dE+\nEcVEwjt+yl/8621ak5xEpBLuhOuSP841L5wua3AzyLFe2jNajJn+p6qYs4HJLK+i\n1FCLdurCQqP7yHt7BPWRa4XZ\n-----END PRIVATE KEY-----\n',
        'client_email': 'firebase-adminsdk-walqt@rawdb-f19d8.iam.gserviceaccount.com',
        'client_id': '116560315843901722055',
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-walqt%40rawdb-f19d8.iam.gserviceaccount.com'
      },
      databaseUrl: 'https://rawdb-f19d8.firebaseio.com' ,
      storagebucket: 'rawdb-f19d8.appspot.com'
    }
  }
}
