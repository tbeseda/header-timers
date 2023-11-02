import assert from 'node:assert/strict'
import HeaderTimers from '../index.js'

const timers = HeaderTimers()
const { start, stop } = timers

start('open')
stop('open')

start('database', 'collecting data')

start('analytics', 'log request data')
await new Promise(resolve => setTimeout(resolve, 100))
stop('analytics')

await new Promise(resolve => setTimeout(resolve, 500))
stop('database')

console.log('TIMER COUNT 3', timers.timersList().length)
assert.equal(timers.timersList().length, 3)

console.log(timers.headerKey)
assert.equal(timers.headerKey, 'Server-Timing')

console.log(timers.values())
console.log(timers.headerValue())
console.log(timers.headerObject())
console.log(timers.fullHeaderString())

start("this won't work")
timers.reset()
stop("this won't work")

console.log('TIMER COUNT 0', timers.timersList().length)
assert.equal(timers.timersList().length, 0)

start('reset')
await new Promise(resolve => setTimeout(resolve, 100))
stop('reset')

console.log('TIMER COUNT 1', timers.timersList().length)
assert.equal(timers.timersList().length, 1)

console.log(timers.values())

timers.reset()
console.log('TIMER COUNT 0', timers.timersList().length)
assert.equal(timers.timersList().length, 0)

start() // 1
stop() // stop 1 => <1ms
stop('bar') // never started => no-op
start() // 2
start('foo')
start() // 3
stop() // stop 3 => <1ms
await new Promise(resolve => setTimeout(resolve, 100))
stop() // stop 2 => 100+ms
stop('foo')

console.log(timers.values())
assert.equal(timers.timersList().length, 4)
