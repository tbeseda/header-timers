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
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing">MDN Reference</a>
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

console.log('TIMER COUNT', timers.timersList().length)

console.log(timers.headerKey)
console.log(timers.values())
console.log(timers.headerValue())
console.log(timers.fullHeaderString())
```

Also...

```js
// ...

start("this won't work")
timers.reset()
stop("this won't work")

console.log('TIMER COUNT', timers.timersList().length)

start('reset')
await new Promise(resolve => setTimeout(resolve, 100))
stop('reset')

console.log('TIMER COUNT', timers.timersList().length)

console.log('NEW Header String', timers.fullHeaderString())
```
