// import { hrtime } from 'node:process' // * maintain old Node 16 support for now
// @ts-ignore - it's there, I promise
const { hrtime } = process
const KEY = 'Server-Timing'

export default function (options = {}) {
  const { enabled = true, prefix = 'n', key = KEY } = options
  if (!enabled) {
    return {
      key,
      start: () => 0,
      stop: () => 0,
      timers: () => [],
      values: () => [],
      value: () => '',
      toObject: () => ({}),
      toString: () => '',
      reset: () => null,
    }
  }

  const _timers = new Map()
  let names = []
  let counter = 1

  function start (name, description) {
    if (!name) {
      name = `${prefix}${counter++}`
      names.push(name)
    }
    const start = hrtime.bigint()
    _timers.set(name, { name, description, start })
    return start
  }

  function stop (name) {
    let autoNamed = false
    if (!name) {
      name = names.at(-1)
      autoNamed = true
    }
    const timer = _timers.get(name)
    if (!timer) return

    if (autoNamed) names.pop()
    const end = hrtime.bigint()
    const ms = Number(end - timer.start) / 1e6

    timer.end = end
    timer.ms = ms
    _timers.set(name, timer)

    return ms
  }

  function reset () {
    names = []
    counter = 1
    _timers.clear()
  }

  function values () {
    const values = []
    for (const { name, description, ms } of _timers.values()) {
      if (!ms) continue
      const value = [name]
      if (description) value.push(`desc="${description}"`)
      value.push(`dur=${ms}`)
      values.push(value.join(';'))
    }

    return values
  }

  const value = () => values().join(', ')
  const toObject = () => ({ [key]: value() })
  const toString = () => `${key}: ${value()}`
  const timers = () => Array.from(_timers.values())

  return {
    key,
    start,
    stop,
    timers,
    values,
    value,
    toObject,
    toString,
    reset,
  }
}
