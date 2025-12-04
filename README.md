## nvs

CLI wrapper for [node-version-use](https://github.com/kmalakoff/node-version-use). Enables running nvu commands via npx without local installation.

### Usage

```bash
# Run without installing locally
npx nvs 14.4.0 npm run test
npx nvs lts npm run test
npx nvs engines node --version

# Or install globally
npm install -g nvs
nvs 14.4.0 npm run test
```

See [node-version-use](https://github.com/kmalakoff/node-version-use) for full documentation.
