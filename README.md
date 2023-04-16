googleApiHelpers
===
Helps you connect to your G documents, and deals with the Google API


# Install App
* in root folder copy credential file in
```
credentials.json
```
* create .env file with:
```
MYSQL_USERNAME = ''
MYSQL_PASSWORD = ''
MYSQL_DATABASE_NAME = ""
MYSQL_PORT = 3308
MYSQL_HOST_URL = ''
```
* install node libs
```
npm install
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

* copy the json Google Auth0 file in root folder, and name it: "credentials.json"
* make sure that "credentials.json" and "token.json" are added in .gitignore
* run the index.js file as a test file.

# Google Sheet API
* write on Google sheet: https://daily-dev-tips.com/posts/nodejs-write-data-in-a-google-sheet/
* 
