const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function run(command) {
  console.log(`\n🚀 Running: ${command}`);
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (e) {
    console.error(`\n❌ Failed: ${command}`);
    process.exit(1);
  }
}

async function main() {
  console.log('🛡️  Console Log Guard - Automated Publisher\n');

  // 1. Run validation
  console.log('📦 Step 1: Validating project...');
  run('npm run all');

  // 2. Get version
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`\nCurrent version: v${pkg.version}`);

  rl.question('Enter new version tag (e.g., 1.0.1): ', (version) => {
    if (!version) {
      console.error('❌ Version is required!');
      process.exit(1);
    }

    const tag = `v${version.replace(/^v/, '')}`;

    // 3. Update package.json version
    console.log(`\n📝 Step 2: Updating version to ${tag}...`);
    pkg.version = version.replace(/^v/, '');
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

    // 4. Git Ops
    console.log('\n🌿 Step 3: Git operations...');
    run('git add .');
    run(`git commit -m "chore: release ${tag}"`);
    run(`git tag -a ${tag} -m "Release ${tag}"`);

    console.log('\n🌎 Step 4: Pushing to remote...');
    try {
        run('git push origin main');
        run(`git push origin ${tag}`);
    } catch (e) {
        console.warn('\n⚠️  Could not push to origin. Please ensure a remote is configured.');
    }

    console.log(`\n✨ Successfully prepared ${tag}!`);
    console.log('\n👉 Final Step: Go to GitHub and publish the Marketplace release using this tag.');
    rl.close();
  });
}

main();
