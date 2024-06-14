# NPM Version Manager <!-- omit in toc -->

- [Tools](#tools)
- [Housekeeping](#housekeeping)
  - [Initialisation (mandatory)](#initialisation-mandatory)
  - [Code quality](#code-quality)
  - [Conventional commits](#conventional-commits)
  - [Versioning](#versioning)
  - [Maintenance](#maintenance)
- [Commands](#commands)
  - [Bump](#bump)
  - [Generate](#generate)

## Tools

- `bun`: [Bun][bun] is a fast JavaScript runtime, package manager, bundler, and test runner.

  To install with [Homebrew][homebrew-bun]

- `biome`: [Biome][biome] format, lint, and more in a fraction of a second.

- `vitest`: [Vitest][vitest] is a Vite-native testing framework (Next Generation Testing Framework)

## Housekeeping

### Initialisation (mandatory)

**Install repository dependencies.**

```bash
# Bun
bun install
# NPM
npm ci
```

**Note: Husky is included in `prepare` NPM script and is now part of NPM lifecycle.**

### Code quality

**To format files.**

_Note: JS and TS files are handled by Biome._

```bash
# Bun
bun run prettier
bun run lint
# NPM
npm run prettier
npm run lint
```

**Tool used to verify code consistency: format, lint, check links, find vulnerabilities, check typography.**

```bash
# Bun
bun run mega-linter
# NPM
npm run mega-linter
```

### Conventional commits

In this repository, **all commits must be conventional commits.**

To help you write commits in a conventional way, you can use [goji].

[goji] help you write conventional commits with [gitmoji support][gitmoji].

### Versioning

To update version, you shall use this tool.

### Maintenance

**To check for vulnerabilities and deprecated NPM packages.**

```bash
# NPM
npm audit
```

**To update interactively to latest versions.**

_Note: This command must be run in services._

```bash
# Bun
bun run update-dependencies
# NPM
npm run update-dependencies
```

## Commands

### Bump

```bash
# Show help
npx -y @cegid/npm-version-manager@latest bump <bump-type> --help

# Bump version on all packages (repository included)
npx -y @cegid/npm-version-manager@latest bump <bump-type> --all
# Equivalent to
npx -y @cegid/npm-version-manager@latest bump <bump-type> --packages --repository

# Note: It uses remote version as reference by default
# Bump version on all packages (repository included) using current version as reference
npx -y @cegid/npm-version-manager@latest bump <bump-type> --all --from-current

# Bump version on all packages (repository excluded)
npx -y @cegid/npm-version-manager@latest bump <bump-type> --packages

# Bump version on repository
npx -y @cegid/npm-version-manager@latest bump <bump-type> --repository

# Bump version on all packages (repository included) if updated
npx -y @cegid/npm-version-manager@latest bump <bump-type> --all --updated
# Equivalent to
npx -y @cegid/npm-version-manager@latest bump <bump-type> --packages --repository --updated

# Bump version on all packages (repository excluded) if updated
npx -y @cegid/npm-version-manager@latest bump <bump-type> --packages --updated

# Bump version on repository if updated
npx -y @cegid/npm-version-manager@latest bump <bump-type> --repository --updated
```

### Generate

```bash
# Show help
npx -y @cegid/npm-version-manager@latest generate --help
```

<!-- Links -->

[bun]: https://bun.sh/
[biome]: https://biomejs.dev/
[goji]: https://github.com/muandane/goji
[gitmoji]: https://gitmoji.dev/
[homebrew-bun]: https://github.com/oven-sh/homebrew-bun
[vitest]: https://vitest.dev/
