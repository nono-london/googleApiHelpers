googleApiHelpers
===
Helps you connect to your G documents, and deals with the Google API


# Install App
### Nodejs libs
```
npm install
```

### create .env file:
add a spredsheet id, you rights to edit

```
G_SHEET_ID = 'example:aksjasKJkjanmnUIU'
```
### 
In order to use the Google API:

* create an App in your Google Cloud
* in root/g_credentials folder save Google API credential as "g_credentials.json" in

```
root/g_credentials/g_credentials.json
```

# Google Account Prerequisites
node.js Tutorial can be found on: https://developers.google.com/sheets/api/quickstart/nodejs
* Create Project
* Enable API:
https://console.cloud.google.com/flows/enableapi?apiid=sheets.googleapis.com
* Manage Credentials:

* In the Google Cloud console, go to Menu menu > APIs & Services > Credentials.
    * Go to Credentials: https://console.cloud.google.com/apis/credentials

    * Click Create Credentials > OAuth client ID.
    * Click Application type > Desktop app.
    * In the Name field, type a name for the credential. This name is only shown in the Google Cloud console.
    * Click Create. The OAuth client created screen appears, showing your new Client ID and Client secret.
    * Click OK. The newly created credential appears under OAuth 2.0 Client IDs.
    * Save the downloaded JSON file as credentials.json, and move the file to your working directory.
* install npm libs:
```
    npm install googleapis@105 @google-cloud/local-auth@2.1.0 --save
```

* copy the json Google Auth0 file in root/g_credentials/, and name it: "g_credentials.json"
* make sure that "g_credentials.json" and "g_token.json" are added in .gitignore

# TODO:
* create tests libs
*




# Sources and useful links
### Google API
* [Create Google API credentials](https://console.cloud.google.com/flows/enableapi?apiid=sheets.googleapis.com
)
* [write on Google sheet](https://daily-dev-tips.com/posts/nodejs-write-data-in-a-google-sheet/)
* 

### Other libs

