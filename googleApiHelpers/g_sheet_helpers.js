const {GAuthHandler, AuthScope} = require('./g_auth_helpers');
const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();
class GSheetHandler extends GAuthHandler{
    
    constructor(authScopes, spreadsheetId){
      super(authScopes);
      this.spreadsheetId=spreadsheetId;
      // https://stackoverflow.com/questions/43431550/async-await-class-constructor
      (async () => {
           await this.getGAuth();
        })();
    }

    async get_sheet_desc(){
      const auth = await this.getGAuth();

      const sheets = google.sheets({version: 'v4', auth});
      const request = await sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        
      });
      console.log(request);
    }


}
let authScopes = [
    AuthScope.SpreadSheet,
    AuthScope.Drive,
  ];
spreadsheetId = process.env.G_SHEET_ID;
gsheet = new GSheetHandler(authScopes, spreadsheetId);
gsheet.get_sheet_desc();