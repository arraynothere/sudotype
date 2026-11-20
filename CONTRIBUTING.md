# Contributing

```sh
git clone https://github.com/arraynothere/sudotype.git
cd sudotype
npm install
npm test
npm run test:types
node bin/sudotype.js doctor
```

## Releasing

1. Add an `NPM_TOKEN` secret (npm "Automation" token) in the GitHub repository settings.
2. Run `npm version patch && git push --follow-tags`.

The package is scoped (`@arraynothere/sudotype`) and `publishConfig.access` is `public`, so a plain `npm publish` works.

The release workflow runs the tests, creates a GitHub Release and publishes to npm.
