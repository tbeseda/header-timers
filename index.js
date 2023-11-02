import { hrtime } from 'node:process'
const KEY = 'Server-Timing'

export default function (options = {}) {
  const { enabled = true, prefix = 'n', headerKey = KEY } = options
  if (!enabled) {
    return {
      headerKey,
      start: () => 0,
      stop: () => 0,
      timers: () => [],
      values: () => [],
      headerValue: () => '',
      headerObject: () => ({}),
      fullHeaderString: () => '',
      reset: () => null,
    }
  }

  const Ts = new Map()
  let autoNames = []
  let autoName = 1

  function start (name, description) {
    if (!name) {
      name = `${prefix}${autoName++}`
      autoNames.push(name)
    }
    const start = hrtime.bigint()
    Ts.set(name, { name, description, start })
    return start
  }

  function stop (name) {
    let autoNamed = false
    if (!name) {
      name = autoNames.at(-1)
      autoNamed = true
    }
    const timer = Ts.get(name)
    if (!timer) return

    if (autoNamed) autoNames.pop()
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

  function headerValue () {
    return values().join(', ')
  }

  function headerObject () {
    return { [headerKey]: headerValue() }
  }

  function fullHeaderString () {
    return `${headerKey}: ${headerValue()}`
  }

  function reset () {
    autoNames = []
    autoName = 1
    Ts.clear()
  }

  return {
    headerKey,
    start,
    stop,
    timers,
    values,
    headerValue,
    headerObject,
    fullHeaderString,
    reset,
  }
}
