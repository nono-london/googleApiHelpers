// https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js

const path = require("path")
const fs = require('fs');



function getAppRootFolder(){
    const root_folder = __dirname;
    return root_folder;
}


function getGCredentialsPath(){
    const dir = path.join(getAppRootFolder(), "g_credentials");
    if (fs.existsSync(dir)) {
    }else{
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir
}


module.exports = {getGCredentialsPath, getAppRootFolder}

