const core = require('@actions/core');
const { scan } = require('./scanner');

async function run() {
  try {
    const targetDir = core.getInput('directory') || '.';
    const extensions = ['.js', '.ts', '.jsx', '.tsx'];
    
    const logsFound = scan(targetDir, {
      extensions,
      onError: (filePath) => core.error(`❌ console.log found in: ${filePath}`)
    });

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
