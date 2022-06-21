# Headless Commerce Demo

![Storefront](/assets/images/storefront.png "Storefront")

## Introduction

This repo contains the source code to demonstrate an example headless commerce application using [Vue Storefront](https://www.vuestorefront.io/commercetools) to bootstrap and example storefront and [Commercetools](https://commercetools.com/) to provide the backing services required for online commerce.

## Prerequisites

### **This codelab requires Node v14.x.x**

> **Warning**
> Newer versions of Node will throw errors while installing dependencies.

If you are running this codelab using [Google Cloud - Cloud Shell Editor](https://cloud.google.com/shell), run the following commands to switch to Node v14:

```bash
nvm install 14
nvm use 14
```

Running the following command should output the correct Node version:

```bash
node --version
```

Output

```bash
v14.x.x
```

## Getting Started

Clone this repo and change your working directory

```bash
git clone https://github.com/googlecodelabs/headless-commerce-demo.git
cd headless-commerce-demo
```

## Commercetools

In order to run this sample, you will need access to a Commercetools account. Feel free to use an existing account or you can sign up for a 60-day [free trial](https://commercetools.com/free-trial).

![Commercetools Free Trial](/assets/images/commercetools-freetrial.png "Commercetools Free Trial")

NOTE: Please be mindful of the region you select for your Commercetools instance as this will be the location where your backend will live and should be closest to your end-users for a production instance.

After signing up, you should receive a verification email that takes you to the Commercetools Merchant Center to setup your account.

Commercetools is also available on the [Google Cloud Marketplace](https://console.cloud.google.com/marketplace/product/commercetools-public/commercetools-platform) making it easy to subscribe through the GCP console and have the billing added automatically to your monthly bill!

## Import Sample Data

### Clone Commercetools Repo and Add Tutorial Data

Commercetools has an existing sample dataset for their example Sunrise Store. We will be providing our own data but using the data import process Commercetools built to import our custom data into our Merchant Center.

Run the following commands to clone the sunrise data repo and copy our sample data over

```bash
git clone https://github.com/commercetools/commercetools-sunrise-data.git
rm -rf commercetools-sunrise-data/data
cp -r import-data commercetools-sunrise-data/data
```

### Create Admin API Client

You will need to provide an API client with admin credentials to our import process to allow our scripts to generate the data required for our demo. Follow these steps to create and setup your Admin Client credentials.

1. Go to your Merchant Center
2. Go to Settings -> Developer Settings -> Create new API client
3. Enter a name for your client (e.g. Admin Client)
4. Choose the `Admin client` template
5. Click `Create API client`
6. At the bottom of the page, choose `Environment Variables (.env)` and copy the output
7. Create a file `.env` in the `commercetools-sunrise-data` directory of this repo and paste the text from the previous step

### Import The Data

Run the following commands to install the Node.js dependencies and run the import data script.

```bash
cd commercetools-sunrise-data
npm install
npm run import:data
```

NOTE: If you get errors in these scripts, you can clear the data with the following command and re-run the process again.

```bash
npm run clean:data
```

## Run the Storefront

The storefront was bootstrapped with the [Vue Storefront CLI](https://docs.vuestorefront.io/v2/general/installation.html). This provides a foundation to build an integrated storefront platform with Commercetools, rather than building from scratch.

### Create Storefront API Client

In order for our storefront to communicate with the Commercetools APIs, you will need to generate a mobile API client for the storefront application.

1. Go to your Merchant Center
2. Go to Settings -> Developer Settings -> Create new API client
3. Enter a name for your client (e.g. Storefront Client)
4. Choose the `Mobile & single-page application client` template
5. Click `Create API client`
6. At the bottom of the Commercetools confirmation page, choose `Environment Variables` and copy the output
7. Create a file `set_env.sh` in the `third_party/storefront` directory of this repo and paste the text from the previous step

### Create Local Environment Variables for Secrets

Our local development server and deployment processes will use environment variables to reference our secrets to prevent hard coding them in our application.

Run the following commands to navigate to the storefront directory and set the local environment variables

```bash
cd third_party/storefront
source set_env.sh
```

### Run Locally

Run the following commands to install the dependencies and start a local development server

```bash
npm install
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to view the storefront!

### Run on GCP

Traditionally, this process would be completed by a CI/CD pipeline and ran after a commit or pull request is merged. Additional files were added (.dockerignore, .gcloudignore) to prevent credentials from being pushed to GCP and instead are referenced locally from environment variables during command line process below.

#### Prerequisites

The following is required to complete the next steps and deploy your storefront to Google Cloud Run

- [Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- [Google Cloud SDK](https://cloud.google.com/sdk)

#### Environment Setup

Run the following command, replacing with your project id, to set the default project

```bash
gcloud config set project <PROJECT_ID>
```

Run the following command to set local variables for the deployment process

```bash
export PROJECT_NUMBER=$(gcloud projects list --filter="$(gcloud config get-value project)" --format="value(PROJECT_NUMBER)")
export CLOUD_RUN_SA="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
```

#### Enable Google Cloud Services

Run the following command to enable the required GCP services

```bash
gcloud services enable cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com
```

#### Store Secrets with Secret Manager

Use the following commands to create Secrets with Secret Manager so you can securely use them with Cloud Run

```bash
printf $CTP_CLIENT_ID | gcloud secrets create ctp-client-id  --data-file=-
printf $CTP_CLIENT_SECRET | gcloud secrets create ctp-client-secret --data-file=-

gcloud secrets add-iam-policy-binding ctp-client-id \
    --member="serviceAccount:$CLOUD_RUN_SA" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding ctp-client-secret \
    --member="serviceAccount:$CLOUD_RUN_SA" \
    --role="roles/secretmanager.secretAccessor"
```

#### Deploying to Cloud Run

Lets deploy our application! Use the following command to build a docker container and deploy it to Cloud Run using a single command!

Run the following command to build and deploy your source code using Cloud Build and Cloud Run

```bash
gcloud beta run deploy storefront --source=. \
  --set-secrets=CTP_CLIENT_SECRET=ctp-client-secret:latest,CTP_CLIENT_ID=ctp-client-id:latest \
  --set-env-vars=CTP_PROJECT_KEY="$CTP_PROJECT_KEY",CTP_AUTH_URL="$CTP_AUTH_URL",CTP_API_URL="$CTP_API_URL",CTP_SCOPES="$CTP_SCOPES" \
  --region=us-east1 \
  --allow-unauthenticated \
  --platform=managed \
  --port=3000
```

NOTE: If you receive a deadline exceeded error, run this command again

## Cleanup

### Delete Your Project

The easiest way to clean up your Google Cloud environment is to delete your project.

Run the following command, replacing with your PROJECT_ID, to delete your project

```bash
gcloud projects delete <PROJECT_ID>
```

### Keep Your Project

If you want to keep your project and just remove the resources you created, run the following commands

Delete the Cloud Run service

```bash
gcloud run services delete storefront --region=us-east1
```

Delete Secret Manager secrets

```bash
gcloud secrets delete ctp-client-id
gcloud secrets delete ctp-client-secret
```

Disable the services

```bash
gcloud services disable cloudbuild.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  artifactregistry.googleapis.com
```

NOTE: Cloud Storage buckets used for Cloud Build will remain, you can delete these manually if required.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.

## License

Apache 2.0; see [`LICENSE`](LICENSE) for details.

## Disclaimer

This project is not an official Google project. It is not supported by
Google and Google specifically disclaims all warranties as to its quality,
merchantability, or fitness for a particular purpose.
