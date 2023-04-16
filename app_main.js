// Update the Google Sheet with the latest data from the database
// You can then use the REST API to receive these data from the net in a JSON format
// REST API URL: https://script.google.com/macros/s/AKfycbx42OuLPncwWnsiTwX447DVCveMA_a-8GQuaxeB_h2TymNgcPL5G4-BpXG_4XapaBMruQ/exec


const mdb_handlers = require('./hp_google_sheet/mdb_handlers/save_mdb_locally');
const google_sheet_helper = require('./hp_google_sheet/google_handlers/google_auth_helper');


async function get_mdb_data(){
    const sql_query = `SELECT a.user_id, a.hp_user_id, a.username, a.user_profile_url, a.user_blocked,
    b.hp_post_id, b.post_datetime, b.post_url, b.post_summary, b.me_too, b.post_tags
    FROM hp_users a LEFT JOIN  hp_trial.forum_posts b 
    ON a.user_id = b.user_id 
    ORDER BY b.post_datetime DESC
    `;
    var results = await  mdb_handlers.readResults(sql_query);
    // console.log(results);
    return results.data;
}

async function update_google_sheet(){
    const mdb_data = await get_mdb_data();
    const SPREADSHEET_ID = "1TqaD8hgEgyBRG4XD2K0hAKPLjP9c8YrEcRZMM3zNhhg";
    const SHEET_NAME  = 'mdb_hp_claims';

    // reformat mdb data as list of rows
    // get columns names
    const column_names = Object.keys(mdb_data[0]);
    
    // get rows
    var dictValuesAsCsv = mdb_data.map(dict => (column_names.map(key => dict[key])));
    dictValuesAsCsv.unshift(column_names);

    console.log(`Found ${mdb_data.length} records in database`);

    // clear existing data
    google_sheet_helper.clearSheet(null,SPREADSHEET_ID, SHEET_NAME);

    // append new data
    google_sheet_helper.writeData(null,SPREADSHEET_ID, SHEET_NAME, dictValuesAsCsv);

}

update_google_sheet();