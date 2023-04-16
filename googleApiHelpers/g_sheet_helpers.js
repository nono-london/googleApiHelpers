const {GAuthHandler, AuthScope} = require('./g_auth_helpers');
const {google} = require('googleapis');
const dotenv = require('dotenv');
const miscHelpers = require('./misc_helpers');


dotenv.config();
class GSheetHandler extends GAuthHandler{
    
    constructor(authScopes, spreadsheetId){
      super(authScopes);
      this.spreadsheetId=spreadsheetId;
      // https://stackoverflow.com/questions/43431550/async-await-class-constructor
      // TO DO: doesn't work, doesn't seem to be awaited for
      (async () => {
           await this.getGAuth();
           console.log("Code has run");
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

    

    
      async updateGSheet(sheetName, sheetNewValues, sheetRange = null, sheetStartCell = null) {
        const auth = await this.getGAuth();
        
        // check that we have the rights to modify the GSheet
        if (!this.authScopes.includes('https://www.googleapis.com/auth/spreadsheets')) {
          console.log(`${AuthScope.SpreadSheet.value} not in auth. scopes:\n${this.authScopes}`);
          return -1;
        }
    
        // set sheet_range_address
        if (sheetRange === null && sheetStartCell === null) {
          console.log('sheetRange and sheetStartCell can not be null at the same time');
          return -1;
        } else if (sheetStartCell !== null) {
          sheetRange = await miscHelpers.buildSheetRange(sheetNewValues, sheetStartCell);
        }
    
        // The ranges to retrieve from the spreadsheet.
        const sheetRangeAddresses = `${sheetName}!${sheetRange}`;
    
        let updatedCells = 0;
        try {
          const sheets = google.sheets({version: 'v4', auth: auth});
          const body = {
            values: sheetNewValues
          };
          const response = await sheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetId,
            range: sheetRangeAddresses,
            valueInputOption: 'USER_ENTERED',
            resource: body
          });
    
          updatedCells = response.data.updatedCells;
    
        } catch (error) {
          console.log(`An error occurred: ${error}`);
        }
    
        return updatedCells;
      }
    
    
    


}
let authScopes = [
    AuthScope.SpreadSheet,
    AuthScope.Drive,
  ];
spreadsheetId = process.env.G_SHEET_ID;
gsheet = new GSheetHandler(authScopes, spreadsheetId);


vals = [['A', 'B'],
['C', 'D'],

]
gsheet.updateGSheet("Sheet1",vals, null, "b7").then((value) => {
  console.log(value);
  // Expected output: "Success!"
});

