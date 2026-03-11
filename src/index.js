const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const targetDir = core.getInput('directory') || '.';
    const extensions = ['.js', '.ts', '.jsx', '.tsx'];
    let logsFound = false;

    // Logic: Recursively find and scan files
    function scanDirectory(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          if (file !== 'node_modules' && file !== '.git' && file !== 'dist') scanDirectory(filePath);
        } else if (extensions.includes(path.extname(file))) {
          const content = fs.readFileSync(filePath, 'utf8');
          // Regex: Look for console.log( but ensure it's not preceded by // on the same line
          // This is a basic check; for complex cases, a proper parser would be better,
          // but this matches the "Regex" requirement.
          const logRegex = /^(?!\s*\/\/).*\bconsole\.log\(/gm;
          if (logRegex.test(content)) {
            core.error(`❌ console.log found in: ${filePath}`);
            logsFound = true;
          }
        }
      });
    }

    scanDirectory(targetDir);

    if (logsFound) {
      core.setFailed('Production code must be clean. Please remove console.log statements.');
    } else {
      core.info('✅ Code is clean!');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
