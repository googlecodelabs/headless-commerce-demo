# Storefront

The storefront was bootstrapped with the [Vue Storefront CLI](https://docs.vuestorefront.io/v2/general/installation.html). You will need to generate a mobile api client to be used from the storefront application.

## Create Storefront API Client

1. Go to your Merchant Center
2. Go to Settings -> Developer Settings -> Create new API client
3. Enter a name for your client (e.g. Storefront Client)
4. Choose the `Mobile & single-page application client` template
5. Click `Create API client`
6. At the bottom of the page, choose `Environment Variables (.env)` and copy the output
7. Create a file `.env` at the root of this repo and paste the text from the previous step

## Run Locally

Install the NodeJS dependencies and run the development server.

```bash
npm install
npm run dev
```

Navigate to http://localhost:3000
