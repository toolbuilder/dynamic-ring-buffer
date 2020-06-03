import { test } from 'zora'
import { DynamicRingBuffer } from '../src/dynamic-ring-buffer'
import { RingBufferDriver } from '@toolbuilder/ring-buffer-tests'
import dequal from 'dequal'

test('test ring buffer interface', assert => {
  const driver = new RingBufferDriver() // taking default options
  const factory = (capacity) => new DynamicRingBuffer(7, capacity)
  const [actual, expected] = driver.testRingBuffer(100, factory)
  assert.deepEqual(actual, expected, 'ring buffer passed test')
})

class ChunkError extends Error {
  constructor (actual, expected, message) {
    super(message)
    this.actual = actual
    this.expected = expected
  }
}

const testChunkCount = (ringbuffer, addName, removeName) => {
  /*
    Going to a bit of effort to avoid large number of TAP test messages by
    providing checkEqual and checkOk
  */
  const checkEqual = (actual, expected, message) => {
    if (!dequal(actual, expected)) {
      throw new ChunkError(actual, expected, message)
    }
  }
  const checkOk = (result, message) => {
    if (!result) throw new ChunkError(null, null, message)
  }

  /*
    This is the ringbuffer invariant for ringbuffer._buffers.
    The only reason to access ringbuffer._buffers is for testing.
  */
  const assertChunksOk = (ringbuffer) => {
    const chunkLengths = [...ringbuffer._buffers].map(buffer => buffer.length)
    const length = chunkLengths.reduce((total, length) => total + length, 0)
    const maxChunkLength = chunkLengths.reduce((max, length) => Math.max(max, length), 0)
    const minChunkLength = chunkLengths.reduce((min, length) => Math.min(min, length), ringbuffer.chunkSize)
    const middleMinimumLength = chunkLengths.slice(1, -1).reduce((min, length) => Math.min(min, length), ringbuffer.chunkSize)
    checkEqual(length, ringbuffer.length, 'all elements in chunks are in use')
    checkOk(maxChunkLength <= ringbuffer.chunkSize, 'no chunks are longer than chunk size')
    checkOk(minChunkLength > 0, 'there are no empty chunks')
    checkEqual(middleMinimumLength, ringbuffer.chunkSize, 'middle chunks are all full length')
  }

  let value = 0
  ringbuffer[addName](value++)
  ringbuffer[removeName]()
  // Grow buffer
  while (ringbuffer.length < ringbuffer.capacity) {
    ringbuffer[addName](value++)
    if (Math.random() > 0.3) ringbuffer[removeName]()
    assertChunksOk(ringbuffer)
  }
  // Stay at max capacity to cycle buffers
  for (let i = 0; i < 2 * ringbuffer.capacity; ++i) {
    ringbuffer[addName](value++)
    assertChunksOk(ringbuffer)
  }
  // Shrink buffer to ensure chunk release
  while (ringbuffer.length > 0) {
    ringbuffer[removeName]()
    if (Math.random() > 0.7) ringbuffer[addName](value++)
    assertChunksOk(ringbuffer)
  }
  // Grow again in case there is an issue shrinking to zero then growing
  while (ringbuffer.length < ringbuffer.capacity) {
    ringbuffer[addName](value++)
    if (Math.random() > 0.3) ringbuffer[removeName]()
    assertChunksOk(ringbuffer)
  }
}

test('test allocation/deallocation of internal buffer chunks', assert => {
  const caughtException = false
  try {
    testChunkCount(new DynamicRingBuffer(7, 99), 'push', 'shift')
    testChunkCount(new DynamicRingBuffer(7, 99), 'unshift', 'pop')
  } catch (error) {
    if (error.actual == null) {
      assert.ok(false, error.message)
    } else {
      assert.deepEqual(error.actual, error.expected, error.message)
    }
  }
  if (caughtException === false) assert.ok(true, 'buffer maintains chunk invariant with push/shift and unshift/pop')
})
