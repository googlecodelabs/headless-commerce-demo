const {
  CTP_PROJECT_KEY,
  CTP_CLIENT_SECRET,
  CTP_CLIENT_ID,
  CTP_AUTH_URL,
  CTP_API_URL,
  CTP_SCOPES
} = process.env;

module.exports = {
  integrations: {
    ct: {
      location: "@vue-storefront/commercetools-api/server",
      configuration: {
        api: {
          uri: `${CTP_API_URL}/${CTP_PROJECT_KEY}/graphql`,
          authHost: CTP_AUTH_URL,
          projectKey: CTP_PROJECT_KEY,
          clientId: CTP_CLIENT_ID,
          clientSecret: CTP_CLIENT_SECRET,
          scopes: [CTP_SCOPES]
        },
        serverApi: {
          clientId: CTP_CLIENT_ID,
          clientSecret: CTP_CLIENT_SECRET,
          scopes: [CTP_SCOPES]
        },
        currency: "USD",
        country: "US"
      }
    }
  }
};
