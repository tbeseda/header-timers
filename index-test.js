import assert from 'node:assert/strict'
import test from 'node:test'
import HeaderTimers from './index.js'

test('header-timers', async (t) => {
  const {
    key,
    start,
    stop,
    reset,
    timers,
    values,
    value,
    toObject,
    toString,
  } = HeaderTimers()

  await t.test('baseline without timers', () => {
    assert.equal(typeof key, 'string')
    assert.equal(timers().length, 0)
    assert.equal(values().length, 0)
    assert.equal(value(), '')
    assert.deepEqual(toObject(), { [key]: '' })
    assert.equal(toString(), `${key}: `)
  })

  await t.test('timer with name and description', () => {
    let one
    one = start('one', 'description')
    assert.equal(typeof one, 'bigint')

    const list = timers()
    assert.equal(list[0].name, 'one')
    assert.equal(list[0].description, 'description')

    one = stop('one')
    assert.equal(typeof one, 'number')

    const vals = values()
    assert(vals[0].startsWith('one;desc="description";dur='))
    assert.equal(value(), vals[0])
    assert.deepEqual(toObject(), { [key]: vals[0] })
    assert.equal(toString(), `${key}: ${vals[0]}`)
  })

  await t.test('timer reset', () => {
    reset()

    assert.equal(timers().length, 0)
    assert.equal(values().length, 0)
  })

  await t.test('timer without description', () => {
    start('two')
    const list = timers()
    assert.equal(list.length, 1)
    assert.equal(list[0].name, 'two')
    assert.equal(list[0].description, undefined)
    stop('two')
    const vals = values()
    assert(vals[0].startsWith('two;dur='))
  })

  await t.test('timer with no args', () => {
    reset()

    start()
    const list = timers()
    assert.equal(list.length, 1)
    assert.equal(list[0].name, 'n1')
    assert.equal(list[0].description, undefined)
    stop()
    const vals = values()
    assert(vals[0].startsWith('n1;dur='))
  })
})

test('header-timers with config', async (t) => {
  await t.test('prefix', () => {
    const {
      key,
      start,
      timers,
    } = HeaderTimers({
      prefix: '$',
      key: 'x-timer',
    })

    assert.equal(key, 'x-timer')

    start()
    const list = timers()
    assert.equal(list[0].name, '$1')
  })

  await t.test('disabled timers', () => {
    const {
      key,
      start,
      stop,
      timers,
      values,
      value,
      toObject,
      toString,
      reset,
    } = HeaderTimers({ enabled: false })

    assert.equal(typeof key, 'string')
    assert.equal(typeof start, 'function')
    assert.equal(typeof stop, 'function')
    assert.equal(start(), 0)
    assert.equal(stop(), 0)
    assert.equal(start('one'), 0)
    assert.equal(stop('one'), 0)
    assert.equal(start('two'), 0)
    assert.equal(stop('two'), 0)
    assert.equal(timers.length, 0)
    assert.equal(values().length, 0)
    assert.equal(value(), '')
    assert.deepEqual(toObject(), { })
    assert.equal(toString(), '')
    assert.equal(reset(), null)
  })
})
