const fs = require('fs');
const path = require('path');

function writeLog(message) {
    const logsDir = path.join(__dirname, 'logs');
    // Ensure the logs directory exists
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    const date = new Date();
    const logFileName = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;

    const logFilePath = path.join(logsDir, logFileName);

    const logEntry = `[${date.toISOString()}] ${message}\n`;

    // To Append the data in file
    fs.appendFileSync(logFilePath, logEntry, 'utf8');
}

module.exports = writeLog;