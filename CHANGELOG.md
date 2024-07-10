# Changelog

## 0.3.0

### Changed

- BREAKING: `#toString()` is now `#string()`
- BREAKING: `#toObject()` is now `#object()`

The `toString` method name was changed to `string` to avoid confusion with the native `toString` method. To keep the API consistent, the `toObject` method was also changed to `object`.

## 0.2.1

### Added

- `count()` method to get current count of timers

### Fixed

- remove space when joining values for `value()`

## 0.2.0

### Added

- JSDoc comments
- `precision` option; default is 3
  1. uses `toPrecision` to set significant figures
  2. then (re)creates a Number
  3. finally reports as string:
    - 3.1459265 -> "3.15"
    - 42.666 -> "42.7"
    - 1.100000000001 -> "1.1"
    - 0.000000000000 -> "0"

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
