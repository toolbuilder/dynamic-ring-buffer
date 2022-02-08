import { List } from '@toolbuilder/list'
import { RingBuffer } from '@toolbuilder/ring-buffer'
/**
 * DynamicRingBuffer implements classic fixed length ring buffer, or circular queue.
 * Memory is dynamically allocated and deallocated in chunks as the buffer grows and
 * shrinks. This allows the buffer to have a large capacity to handle data bursts, while
 * minimizing memory use during normal operation.
 *
 * When the buffer length reaches capacity, the oldest values are quietly thrown away.
 * The methods match the Array signature for push, pop, unshift, and shift. For buffer
 * operation either use push/shift together, or unshift/pop together.
 *
 * DynamicRingBuffer allocates and deallocates internal buffers as the length increases
 * and decreases to tolerate rare bursts of data, while using memory frugally when data
 * flows slow.
 * @template Type
 */
export class DynamicRingBuffer {
  /**
   * Constructs a DynamicRingBuffer with fixed maximum capacity.
   * @param {number} chunkSize - buffer will grow and shrink in chunkSize increments
   * @param {number} capacity - maximum number of values in the buffer
   */
  constructor (chunkSize = 100, capacity = Number.MAX_SAFE_INTEGER) {
    this.chunkSize = chunkSize
    this.capacity = capacity
    /** @type List<Type> */
    this._buffers = List.from() // empty doubly linked list of RingBuffers
    this.length = 0
  }

  /**
   * Empties the ring buffer.
   * @returns {void}
   */
  clear () {
    this._buffers = List.from()
    this.length = 0
  }

  /**
   * Returns the value at the back of the buffer.
   * @returns {Type} - the back of the buffer, or `undefined` if empty
   */
  back () {
    if (this.length === 0) return undefined
    return this._buffers.last().back()
  }

  /**
   * Returns the value at the front of the buffer.
   * @returns {Type} - the front of the buffer, or `undefined` if empty
   */
  front () {
    if (this.length === 0) return undefined
    return this._buffers.first().front()
  }

  /**
   * Pushes a value onto the back of the buffer. If length === capacity,
   * the value at the front of the buffer is discarded.
   * @param {Type} value - value to push
   * @returns {number} - current length of buffer
   */
  push (value) {
    if (this.length === this.capacity) this.shift()
    if (this._buffers.length === 0) this._buffers.push(new RingBuffer(this.chunkSize))
    let lastBuffer = this._buffers.last()
    if (lastBuffer.length === lastBuffer.capacity) {
      this._buffers.push(new RingBuffer(this.chunkSize))
      lastBuffer = this._buffers.last()
    }
    this.length++
    lastBuffer.push(value)
    return this.length
  }

  /**
   * Removes a value from the back of the buffer and returns it. The
   * newly empty buffer location is set to undefined to release any
   * object references.
   * @returns {Type} the value removed from the back of the buffer
   * or `undefined` if empty.
   */
  pop () {
    if (this.length === 0) return undefined
    const lastBuffer = this._buffers.last()
    if (lastBuffer.length === 1) this._buffers.pop()
    this.length--
    return lastBuffer.pop()
  }

  /**
   * Removes a value from the front of the buffer and returns it. The
   * newly empty buffer location is set to undefined to release any
   * object references.
   * @returns {Type} the value removed from the front of the buffer
   * or `undefined` if empty.
   */
  shift () {
    if (this.length === 0) return undefined
    const firstBuffer = this._buffers.first()
    if (firstBuffer.length === 1) this._buffers.shift()
    this.length--
    return firstBuffer.shift()
  }

  /**
   * Pushes a value on the front of the buffer. If length === capacity,
   * the value at the back is discarded.
   * @param {Type} value - to push onto the front
   * @returns {number} - current length of buffer
   */
  unshift (value) {
    if (this.length === this.capacity) this.pop()
    if (this._buffers.length === 0) this._buffers.unshift(new RingBuffer(this.chunkSize))
    let firstBuffer = this._buffers.first()
    if (firstBuffer.length === firstBuffer.capacity) {
      this._buffers.unshift(new RingBuffer(this.chunkSize))
      firstBuffer = this._buffers.first()
    }
    this.length++
    firstBuffer.unshift(value)
    return this.length
  }

  /**
   * Iterator that goes from front to back.
   * @returns {IterableIterator<Type>} - iterates from front to back
   */
  * [Symbol.iterator] () {
    for (const buffer of this._buffers) {
      for (const value of buffer) {
        yield value
      }
    }
  }
}
