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
    
    
    async clearGSheetRange(sheetName, sheetRange = null) {
    // check that we have the rights to modify the GSheet
    const auth = await this.getGAuth();
    const requiredAuthScopes = [
        AuthScope.SpreadSheet,
        AuthScope.Drive,
        AuthScope.DriveFile
    ];
    if (!requiredAuthScopes.some((scope) => this.authScopes.includes(scope))) {
        console.log(`${AuthScope.SpreadSheet} or ${AuthScope.SpreadSheetReadOnly} not in auth. scopes:\n${this.authScopes}`);
        return null;
    }
    
    // The ranges to retrieve from the spreadsheet.
    const sheetRangeAddresses = sheetRange ? `${sheetName}!${sheetRange}` : sheetName;
    
    try {
        const service = google.sheets({version: 'v4', auth: auth});
        
        const clearValuesRequestBody = {};
    
        const request = service.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: sheetRangeAddresses,
        requestBody: clearValuesRequestBody
        });
    
        const response = await request;
        return response.data.clearedRange;
    } catch (error) {
        console.log(`An error occurred: ${error}`);
        return null;
    }
    }

    async createSpreadsheet(spreadsheetName) {
        // https://developers.google.com/sheets/api/guides/create#python
        const auth = await this.getGAuth();
        // check that we have the rights to modify/Create the GSheet
        if (![
          AuthScope.SpreadSheet,
          AuthScope.Drive,
        ].some(scope => this.authScopes.includes(scope))) {
          console.log(`${AuthScope.Drive} or ${AuthScope.SpreadSheet} not in auth. scopes:\n${this.authScopes}`);
          return null;
        }
        
        try {
          const service = google.sheets({ version: 'v4', auth: auth });
          const spreadsheet = await service.spreadsheets.create({
            requestBody: {
              properties: {
                title: spreadsheetName,
              },
            },
            fields: 'spreadsheetId',
          });
      
          console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
          return spreadsheet.data.spreadsheetId;
        } catch (error) {
          console.log(`An error occurred: ${error}`);
          return null;
        }
      }
      

      async createNewSheet(sheetName) {
        // check that we have the rights to modify/Create the GSheet
        const auth = await this.getGAuth();
        if (![
            AuthScope.SpreadSheet,
            AuthScope.Drive,
          ].some(scope => this.authScopes.includes(scope))) {
            console.log(`${AuthScope.Drive} or ${AuthScope.SpreadSheet} not in auth. scopes:\n${this.authScopes}`);
            return null;
          }
      
        try {
          const sheets = google.sheets({ version: 'v4', auth: auth });
          const request = {
            'addSheet': {
              'properties': {
                'title': sheetName,
              },
            },
          };
          // Create a batch update request containing the addSheet request
          const batch_update_request = {
            'requests': [request],
          };
      
          // Execute the batch update request
          const response = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: this.spreadsheetId,
            requestBody: batch_update_request,
          });
          return response.data.replies[0].addSheet.properties;
        } catch (error) {
          console.log(`An error occurred: ${error}`);
          return null;
        }
      }
      

      async deleteSheet(sheetName = null, sheetId = -1) {
        const auth = await this.getGAuth();
        // check that we have the rights to modify/Create the GSheet
        if (!this.authScopes.includes(AuthScope.SpreadSheet)) {
          console.log(`${AuthScope.SpreadSheet} not in auth. scopes:\n${this.authScopes}`);
          return null;
        }
      
        // get sheet id
        if (sheetId === -1 && sheetName !== null) {
          const spreadsheetDesc = await this.getSheetsProperties();
          for (const sheet of spreadsheetDesc) {
            if (sheet.title.toUpperCase() === sheetName.toUpperCase()) {
              sheetId = sheet.sheetId;
              break;
            }
          }
          if (sheetId === -1) {
            console.log(`Error ${sheetName} was not found in workbook sheets:\n${spreadsheetDesc}`);
            return null;
          }
        }
      
        // create a DeleteSheetRequest object
        const deleteRequest = {
          deleteSheet: {
            sheetId: sheetId,
          },
        };
      
        // create a batch update request
        const batchUpdateRequest = {
          requests: [deleteRequest],
        };
      
        try {
          // execute the batch update request to delete the sheet
          const service = google.sheets({ version: 'v4',});
          const response = service.spreadsheets.batchUpdate({
            auth: auth,
            spreadsheetId: this.spreadsheetId,
            requestBody: batchUpdateRequest,
          });
          console.log('Sheet deleted successfully!');
          return response.data;
        } catch (error) {
          console.log(`An error occurred: ${error}`);
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


vals = [['A', 'B'],
['C', 'D'],

]
gsheet.deleteSheet("Sheet5").then((value) => {
  console.log(value);
  // Expected output: "Success!"
});

module.exports = {GSheetHandler}