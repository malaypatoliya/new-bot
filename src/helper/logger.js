const fs = require("fs");
const path = require("path");
const moment = require('moment');

// Logger function to save logs to file
function logToFile(logData) {
    const logFileName = moment().format('DD-MM-YYYY(HH-mm)');
    const logFilePath = path.join(__dirname, "..", "logs", `${logFileName}.json`);

    // Ensure the logs folder exists
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
        fs.mkdirSync(path.join(__dirname, "..", "logs"));
    }

    // Write the log data to the file
    fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

    console.log(`- Logs saved to ${logFilePath}`);
}

module.exports = { logToFile };
