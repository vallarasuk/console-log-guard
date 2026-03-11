const fs = require('fs');
const path = require('path');

/**
 * Scans a directory for console.log statements.
 * @param {string} dir Directory to scan
 * @param {Object} options Options
 * @param {string[]} options.extensions Extensions to scan
 * @param {Function} options.onError Callback for when a log is found
 * @returns {boolean} True if logs were found
 */
function scan(dir, { extensions, onError }) {
  let logsFound = false;

  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      if (fs.statSync(filePath).isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
          scanDirectory(filePath);
        }
      } else if (extensions.includes(path.extname(file))) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Refined Logic (Regex-based):
        // 1. Remove block comments
        // 2. Remove line comments
        // 3. Remove strings/template literals
        // 4. Look for console.log
        
        // This is a simplified approach using regex to strip noise before checking
        const strippedContent = content
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '') // Strip comments
          .replace(/(['"`])(?:\\.|(?!\1)[^\\\n])*\1/g, '');    // Strip strings
          
        if (/\bconsole\.log\s*\(/.test(strippedContent)) {
          if (onError) onError(filePath);
          logsFound = true;
        }
      }
    });
  }

  scanDirectory(dir);
  return logsFound;
}

module.exports = { scan };
