
// https://developers.google.com/docs/api/quickstart/nodejs
const path = require("path");
const fs = require('fs').promises;
const app_config = require('./app_config');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const AuthScope = Object.freeze({
    SpreadSheet : 'https://www.googleapis.com/auth/spreadsheets',
    SpreadSheetReadOnly : 'https://www.googleapis.com/auth/spreadsheets.readonly',
    Drive : 'https://www.googleapis.com/auth/drive',
    DriveFile : 'https://www.googleapis.com/auth/drive.file',
    DriveReadOnly : 'https://www.googleapis.com/auth/drive.readonly'
  });


class GAuthHandler {
    constructor(authScopes) {
      // scope
      this.authScopes = authScopes;
 
      // credentials
      this.credentialFolderPath = app_config.getGCredentialsPath();
      this.credentialPath = path.join(this.credentialFolderPath, "g_credentials.json");

      this.tokenPath = path.join(this.credentialFolderPath, "g_token.json");
      this.authorizedCreds = null;

    }

    
    async loadSavedCredentialsIfExist() {
        try {
          const content = await fs.readFile(this.tokenPath);
          const credentials = JSON.parse(content);
          return google.auth.fromJSON(credentials);
        } catch (err) {
          return null;
        }
      }
    async saveCredentials(client) {
        const content = await fs.readFile(this.credentialPath);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
          type: 'authorized_user',
          client_id: key.client_id,
          client_secret: key.client_secret,
          refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(this.tokenPath, payload);
      }

    async getGAuth() {
        // check if a token has already been given
        let client = await this.loadSavedCredentialsIfExist();
        if (client) {
            this.authorizedCreds=client;
            
            return client;
        }else{
            console.log('User need to provide a g_credentials.json file\nREADME.md file');
        }
        client = await authenticate({
            scopes: this.authScopes,
            keyfilePath: this.credentialPath,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }

        this.authorizedCreds=client;
        
        return client;
        
    }


}






let authScopes = [
    AuthScope.SpreadSheet,
    AuthScope.Drive,
  ];

const gauth = new GAuthHandler(authScopes);
 gauth.getGAuth();



 module.exports = {GAuthHandler, AuthScope}