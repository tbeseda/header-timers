import assert from 'node:assert/strict'
import test from 'node:test'
import HeaderTimers from './index.js'

test('header-timers', async (t) => {
  const { key, start, stop, reset, timers, count, values, value, object, string } = HeaderTimers()

  await t.test('baseline without timers', () => {
    assert.equal(typeof key, 'string')
    assert.equal(count(), 0)
    assert.equal(timers().length, 0)
    assert.equal(values().length, 0)
    assert.equal(value(), '')
    assert.deepEqual(object(), { [key]: '' })
    assert.equal(string(), `${key}: `)
  })

  await t.test('timer with name and description', () => {
    let one
    one = start('one', 'description')
    assert.equal(typeof one, 'bigint')
    assert.equal(count(), 1)

    const list = timers()
    assert.equal(list[0].name, 'one')
    assert.equal(list[0].description, 'description')

    one = stop('one')
    assert.equal(typeof one, 'number')

    const vals = values()
    assert(vals[0].startsWith('one;desc="description";dur='))
    assert.equal(value(), vals[0])
    assert.deepEqual(object(), { [key]: vals[0] })
    assert.equal(string(), `${key}: ${vals[0]}`)

    start('two')
    assert.equal(count(), 2)
    stop('two')
    assert.equal(count(), 2)
    assert.ok(value().indexOf(' ') === -1)
  })

  await t.test('timer reset', () => {
    reset()

    assert.equal(count(), 0)
    assert.equal(timers().length, 0)
    assert.equal(values().length, 0)
  })

  await t.test('timer without description', () => {
    start('three')
    const list = timers()
    assert.equal(count(), 1)
    assert.equal(list[0].name, 'three')
    assert.equal(list[0].description, undefined)
    stop('three')
    const vals = values()
    assert(vals[0].startsWith('three;dur='))
  })

  await t.test('timer with no args', () => {
    reset()

    start()
    const list = timers()
    assert.equal(count(), 1)
    assert.equal(list[0].name, 'n1')
    assert.equal(list[0].description, undefined)
    stop()
    const vals = values()
    assert(vals[0].startsWith('n1;dur='))
  })
})

test('header-timers with config', async (t) => {
  await t.test('prefix and key', () => {
    const { key, start, timers } = HeaderTimers({
      prefix: '$',
      key: 'x-timer',
    })

    assert.equal(key, 'x-timer')

    start()
    const list = timers()
    assert.equal(list[0].name, '$1')
  })

  await t.test('precision', async () => {
    let precision = 1

    const timers1 = HeaderTimers({ precision })

    timers1.start()
    await new Promise((resolve) => setTimeout(resolve, 100))
    timers1.stop()

    const dur1 = timers1.values()[0].split(';')[1].split('=')[1]
    assert.equal(typeof dur1, 'string')
    assert.equal(dur1, '100')

    precision = 100
    const timers100 = HeaderTimers({ precision })

    timers100.start()
    await new Promise((resolve) => setTimeout(resolve, 100))
    const ms = timers100.stop()

    const dur100 = timers100.values()[0].split(';')[1].split('=')[1]
    assert.equal(typeof ms, 'number')
    assert.equal(dur100, ms?.toString())
  })

  await t.test('disabled timers', () => {
    const { key, start, stop, timers, count, values, value, object, string, reset } = HeaderTimers({
      enabled: false,
    })

    assert.equal(typeof key, 'string')
    assert.equal(typeof start, 'function')
    assert.equal(typeof stop, 'function')
    assert.equal(start(), 0n)
    assert.equal(stop(), 0)
    assert.equal(start('one'), 0n)
    assert.equal(stop('one'), 0)
    assert.equal(start('two'), 0n)
    assert.equal(stop('two'), 0)
    assert.equal(count(), 0)
    assert.equal(timers().length, 0)
    assert.equal(values().length, 0)
    assert.equal(value(), '')
    assert.deepEqual(object(), {})
    assert.equal(string(), '')
    assert.equal(reset(), null)
  })
})
