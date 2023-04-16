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

    async getSheetDesc(){
      const auth = await this.getGAuth();

      const sheets = google.sheets({version: 'v4', auth});
      const request = await sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
        
      });
      return request.data?? null;
    }

    async getSheetsProperties(){
      const data = await this.getSheetDesc();
      const sheets=data.sheets;
      
      if (sheets){
        let sheetProperties = sheets.map(sheet => {
            const propertyEntries = Object.entries(sheet.properties);
            return propertyEntries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
            }, {});
        });
        
        
        return sheetProperties
      }else{
        return null;
      }


    }


}
let authScopes = [
    AuthScope.SpreadSheet,
    AuthScope.Drive,
  ];
spreadsheetId = process.env.G_SHEET_ID;
gsheet = new GSheetHandler(authScopes, spreadsheetId);
gsheet.getSheetsProperties().then((value) => {
  console.log(value);
  // Expected output: "Success!"
});

