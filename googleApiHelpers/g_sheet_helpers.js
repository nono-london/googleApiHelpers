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
        const reponse = await sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,

        });
        return reponse.data?? null;
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

    async readSheet(sheetName, sheetRange){
        // https://developers.google.com/sheets/api/quickstart/nodejs
        const sheetRangeAddress = sheetName + "!" + String(sheetRange).toUpperCase();
        const auth = await this.getGAuth();

        const sheets = google.sheets({version: 'v4', auth});
        const reponse = await sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: sheetRangeAddress,
          });
          const rows = reponse.data.values;
          if (!rows || rows.length === 0) {
            console.log('No data found.');
            return null;
          }else{
            return rows;
          }

    }

    


}
let authScopes = [
    AuthScope.SpreadSheet,
    AuthScope.Drive,
  ];
spreadsheetId = process.env.G_SHEET_ID;
gsheet = new GSheetHandler(authScopes, spreadsheetId);
gsheet.readSheet("Sheet1", "A1:Z30").then((value) => {
  console.log(value);
  // Expected output: "Success!"
});

