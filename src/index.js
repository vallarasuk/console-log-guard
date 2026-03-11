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
          if (file !== 'node_modules' && file !== '.git') scanDirectory(filePath);
        } else if (extensions.includes(path.extname(file))) {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.includes('console.log(')) {
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
      console.log('✅ Code is clean!');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
