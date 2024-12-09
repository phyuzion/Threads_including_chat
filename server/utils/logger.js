const fs = require('fs');
const path = require('path');

// 로그 파일 경로
const logFilePath = path.join(__dirname, '../logs/admin.log');

const logAdminAction = (action, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${action} - ${JSON.stringify(details)}\n`;

  // 로그 파일에 기록
  fs.appendFileSync(logFilePath, logEntry, { encoding: 'utf8' });
};

module.exports = logAdminAction;