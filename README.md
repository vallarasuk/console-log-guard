# Console Log Guard 🚀

Console Log Guard is a high-performance GitHub Action designed to enforce MNC-level code quality. It acts as a gatekeeper in your CI/CD pipeline, automatically scanning Pull Requests to detect and block forgotten `console.log` statements before they reach production.

## Features
- **Fast**: Recursively scans directories in seconds.
- **Language Support**: Works with `.js`, `.ts`, `.jsx`, and `.tsx`.
- **Smart**: Focuses only on code, ignoring common binary or metadata directories.
- **Zero Configuration**: Works out of the box.

## Usage

Add this to your `.github/workflows/main.yml`:

```yaml
steps:
- uses: actions/checkout@v4
- name: Console Log Guard
  uses: ./ # Use the local action (if in the same repo) or vallarasuk/console-log-guard@v1
  with:
    directory: '.' # Optional: target directory
```

## Inputs

| Input | Description | Default |
|-------|-------------|---------|
## Development & Testing

### Test Cases
The project includes a comprehensive test suite in the `tests/` directory covering various scenarios:
- **fail-active.js**: Detects standard console logs.
- **pass-line-comment.js**: Ignores logs in `//` comments.
- **pass-block-comment.js**: Ignores logs in `/* */` comments.
- **pass-strings.js**: Ignores logs inside string literals and regex.

### Steps to Run Tests
1. Install dependencies: `npm install`
2. Run the test suite: `npm test`
3. Build the action: `npm run build`

## Automated Publishing 📦

You can use the built-in automation script to handle the git workflow:

```bash
npm run publish-act
```

This script will:
1. Run all tests and build the project.
2. Prompt you for a new version number.
3. Update `package.json`.
4. Create a git commit and a tagged release.
5. Push everything to GitHub.

After running this, simply go to your GitHub repo's **Releases** page and publish the Marketplace draft.

## License
ISC

