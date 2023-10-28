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

console.log('TIMER COUNT', timers.timersList().length)

console.log(timers.headerKey)
console.log(timers.values())
console.log(timers.headerValue())
console.log(timers.fullHeaderString())

start("this won't work")
timers.reset()
stop("this won't work")

console.log('TIMER COUNT', timers.timersList().length)

start('reset')
await new Promise(resolve => setTimeout(resolve, 100))
stop('reset')

console.log('TIMER COUNT', timers.timersList().length)

console.log('NEW Header String', timers.fullHeaderString())
