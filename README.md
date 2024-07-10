<h1 align="center"><code>header-timers</code> ⏱️</h1>

<p align="center">
  <strong>Server-Timing HTTP header helper</strong><br>
  Create timers and report to the browser with a <code>Server-Timing</code> header.<br>
  <a href="https://www.npmjs.com/package/header-timers"><strong><code>header-timers</code> on npmjs.org »</strong></a><br>
  <br>
  Contents:
  <a href="#Install">Install</a>
  •
  <a href="#Usage">Usage</a>
  •
  <a href="#Goals">Goals</a>
  •
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing"><code>Server-Timing</code> Reference</a>
</p>

## Install

```sh
npm i header-timers
```

> [!NOTE]  
> This is a Node.js library and won't work in a browser runtime.

## Usage

Just .js samples for now:

```js
import HeaderTimers from 'header-timers'

const timers = HeaderTimers()
const { start, stop } = timers

start('open')
stop('open')

start('database', 'collecting data') // with a description

start('analytics', 'log request data')
await new Promise(resolve => setTimeout(resolve, 100))
stop('analytics')

await new Promise(resolve => setTimeout(resolve, 500))
stop('database')

console.log('TIMER COUNT', timers.timers().length) // 3

console.log(timers.key)
// "Server-Timing" - just in case you need it!
console.log(timers.timers())
// [ Array of Timer Objects ]
console.log(timers.values())
/**
 [
   'open;dur=0.026ms',
   'database;desc="collecting data";dur=603.098792ms',
   'analytics;desc="log request data";dur=101.776917ms'
 ]
*/
console.log(timers.value()) 
// "open;dur=0.014ms, database;desc="collecting data";dur=603.512ms, analytics;desc="log request data";dur=101.475709ms"
console.log(timers.string())
// "Server-Timing: open;dur=0.014ms, database;desc="collecting data";dur=603.512ms, analytics;desc="log request data";dur=101.475709ms"
console.log(timers.object())
/**
 {
   'Server-Timing': 'open;dur=0.026ms, database;desc="collecting data";dur=603.098792ms, analytics;desc="log request data";dur=101.776917ms'
 }
*/
```

Also...

```js
// ...

start("this won't work")
timers.reset()
stop("this won't work")

console.log('TIMER COUNT', timers.timers().length) // 0

start('reset')
await new Promise(resolve => setTimeout(resolve, 100))
stop('reset')

console.log('TIMER COUNT', timers.timers().length) // 1

console.log('NEW Header String', timers.string())
// NEW Header String "Server-Timing: reset;dur=101.799166ms"
```

And...

```js
// names optional; be aware of the order, though!
start() // 1
stop()  // stop 1 => <1ms

start() // 2
start('foo')
start() // 3

stop() // stop 3 => <1ms

await new Promise(resolve => setTimeout(resolve, 100))

stop() // stop 2 => 100+ms
stop('foo') // => 100+ms
```

## Goals

Be helpful and accurate. Stay small and fast. Then be intuitive. This means:

- zero dependencies
- measure in nanoseconds
- option to disable
- fast primitives/operations (this needs review)
  - no Classes
- terse but readable API

---

_"It's just strings all the way down"_
