import { hrtime } from 'node:process'
const KEY = 'Server-Timing'

export default function (options = {}) {
  const { enabled = true, key = KEY } = options
  if (!enabled) {
    return {
      headerKey: key,
      start: () => 0,
      stop: () => 0,
      timersList: () => [],
      values: () => [],
      headerValue: () => '',
      fullHeaderString: () => '',
      reset: () => null,
    }
  }

  const headerKey = key
  const timers = new Map()

  function start (name, description) {
    const start = hrtime.bigint()
    timers.set(name, { name, description, start })
    return start
  }

  function stop (name) {
    const timer = timers.get(name)
    if (!timer) return

    const end = hrtime.bigint()
    const ms = Number(end - timer.start) / 1e6

    timer.end = end
    timer.ms = ms
    timers.set(name, timer)

    return ms
  }

  function timersList () {
    return Array.from(timers.values())
  }

  function values () {
    const values = []
    for (const { name, description, ms } of timers.values()) {
      if (!ms) continue
      values.push(`${name};${description ? `desc="${description}";` : ''}dur=${ms}ms`)
    }

    return values
  }

  function headerValue () {
    return values().join(', ')
  }

  function fullHeaderString () {
    return `${headerKey}: ${headerValue()}`
  }

  function reset () {
    timers.clear()
  }

  return {
    headerKey,
    start,
    stop,
    timersList,
    values,
    headerValue,
    fullHeaderString,
    reset,
  }
}
