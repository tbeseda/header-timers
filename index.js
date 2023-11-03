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

  const Ts = new Map()
  let names = []
  let counter = 1

  function start (name, description) {
    if (!name) {
      name = `${prefix}${counter++}`
      names.push(name)
    }
    const start = hrtime.bigint()
    Ts.set(name, { name, description, start })
    return start
  }

  function stop (name) {
    let autoNamed = false
    if (!name) {
      name = names.at(-1)
      autoNamed = true
    }
    const timer = Ts.get(name)
    if (!timer) return

    if (autoNamed) names.pop()
    const end = hrtime.bigint()
    const ms = Number(end - timer.start) / 1e6

    timer.end = end
    timer.ms = ms
    Ts.set(name, timer)

    return ms
  }

  function timers () {
    return Array.from(Ts.values())
  }

  function values () {
    const values = []
    for (const { name, description, ms } of Ts.values()) {
      if (!ms) continue
      values.push(`${name};${description ? `desc="${description}";` : ''}dur=${ms}ms`)
    }

    return values
  }

  function value () {
    return values().join(', ')
  }

  function toObject () {
    return { [key]: value() }
  }

  function toString () {
    return `${key}: ${value()}`
  }

  function reset () {
    names = []
    counter = 1
    Ts.clear()
  }

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
