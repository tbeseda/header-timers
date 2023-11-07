# Changelog

## 0.2.0

### Added

- `precision` option; default is 3
  - uses `Number.prototype.toPrecision` to set significant figures
  - 3.1459265 -> 3.15
  - 42.666 -> 42.7
  - 0.000000000000 -> 0.00

## 0.1.1

### Changed

- Do not append "ms" units to durations

## 0.1.0

API settled and tested. minor release

## 0.0.3

### Changed

- `headerKey` is now `key`
- `headerValue` is now `value`
- `fullHeaderString` is now `toString`
- `headerObject` is now `toObject`

## 0.0.2

### Added

- unnamed timers are now supported

### Changed

- `timersList` is now `timers`

## 0.0.1

- Initial release
