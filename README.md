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
| `directory` | The directory to scan for console.log statements | `.` |

## License
ISC
