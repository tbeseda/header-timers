// import { hrtime } from 'node:process' // * maintain old Node 16 support for now
// @ts-ignore - it's there, I promise
const { hrtime } = process
const KEY = 'Server-Timing'

/**
 * @typedef {Object} HeaderTimers
 * @property {string} key
 * @property {(name?: string, description?: string) => bigint} start
 * @property {(name?: string) => number | void} stop
 * @property {() => { name: string, description?: string, start: bigint, end?: bigint, ms?: number }[]} timers
 * @property {() => number} count
 * @property {() => string[]} values
 * @property {() => string} value
 * @property {() => Record<string, string>} object
 * @property {() => string} string
 * @property {() => void} reset
 */

/**
 * @param {{ enabled?: boolean, precision?: number, prefix?: string, key?: string }} [options]
 * @returns {HeaderTimers}
 */
export default function ({ enabled = true, precision = 3, prefix = 'n', key = KEY } = {}) {
  if (!enabled) {
    return {
      key,
      start: () => 0n,
      stop: () => 0,
      timers: () => [],
      count: () => 0,
      values: () => [],
      value: () => '',
      object: () => ({}),
      string: () => '',
      reset: () => null,
    }
  }

  /** @type {Map<string, { name: string, description?: string, start: bigint, end?: bigint, ms?: number }>} */
  const _timers = new Map()
  let names = []
  let counter = 1

  /**
   * @param {string} [name]
   * @param {string} [description]
   * @returns {bigint}
   */
  function start(name, description) {
    let timerName = name
    if (!timerName) {
      timerName = `${prefix}${counter++}`
      names.push(timerName)
    }
    const start = hrtime.bigint()
    _timers.set(timerName, { name: timerName, description, start })
    return start
  }

  /**
   * @param {string} [name]
   * @returns {number | void}
   */
  function stop(name) {
    let timerName = name
    let autoNamed = false
    if (!timerName) {
      timerName = names.at(-1)
      autoNamed = true
    }
    if (!timerName) return
    const timer = _timers.get(timerName)
    if (!timer) return

    if (autoNamed) names.pop()
    const end = hrtime.bigint()
    const ms = Number(end - timer.start) / 1e6

    timer.end = end
    timer.ms = ms
    _timers.set(timerName, timer)

    return ms
  }

  /** @returns {void} */
  function reset() {
    names = []
    counter = 1
    _timers.clear()
  }

  /** @returns {string[]} */
  function values() {
    const values = []
    for (const { name, description, ms } of _timers.values()) {
      if (!ms) continue
      const value = [name]
      if (description) value.push(`desc="${description}"`)
      value.push(`dur=${Number(ms.toPrecision(precision)).toString()}`)
      values.push(value.join(';'))
    }

    return values
  }

  /** @returns {string} */
  const value = () => values().join(',')
  /** @returns {Record<string, string>} */
  const object = () => ({ [key]: value() })
  /** @returns {string} */
  const string = () => `${key}: ${value()}`
  /** @returns {{ name: string, description?: string, start: bigint, end?: bigint, ms?: number }[]} */
  const timers = () => Array.from(_timers.values())
  /** @returns {number} */
  const count = () => _timers.size

  return {
    key,
    start,
    stop,
    timers,
    count,
    values,
    value,
    object,
    string,
    reset,
  }
}
