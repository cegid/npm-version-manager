# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 1.0.3

### Added

- Throws an error if none of the options is selected among `--all`, `--repository`, `--packages`

### Changed

- Rework options combination for `--all`, `--repository`, `--packages` and `--updated`
- Update `README.md` accordingly
- Update NPM dependencies

### Removed

- Remove log if option `--repository` is selected

## 1.0.2

### Added

- Add option `--packages` to bump version only on packages (repository excluded)
- Add alias `-p` for `--packages`

### Changed

- Use basic bump types to change version: `patch`, `minor`, `major`, `premajor`, `preminor`, `prepatch`, `prerelease`
- Update packages filter to handle all options `--all`, `--packages`, `--updated` and `--repository`
- Update documentation

### Removed

- Remove default behavior to bump version on updated packages using remote version as reference

## 1.0.1

### Added

- Add aliases `h` and `v` for `help` and `version`
- Add aliases `--fc` and `--fr` for `--from-current` and `--from-remote`
- Ensure `origin/HEAD` is set as commands rely on it

### Changed

- No bump when `package.json` doesn't exist on `master`

### Fixed

- Avoid error if there is no upstream branch when doing `git pull --rebase` command
- When calling method `handleError` in class `Errors`, also change the process exit code to `1`

## 1.0.0

### Added

- Repository initialisation
