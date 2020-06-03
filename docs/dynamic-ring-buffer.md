# Table of Contents

* [DynamicRingBuffer](#dynamicringbuffer)
  * [clear](#clear)
  * [back](#back)
  * [front](#front)
  * [push](#push)
  * [pop](#pop)
  * [shift](#shift)
  * [unshift](#unshift)
  * [iterator](#iterator)

## DynamicRingBuffer

DynamicRingBuffer implements classic fixed length ring buffer, or circular queue.
Memory is dynamically allocated and deallocated in chunks as the buffer grows and
shrinks. This allows the buffer to have a large capacity to handle data bursts, while
minimizing memory use during normal operation.

When the buffer length reaches capacity, the oldest values are quietly thrown away.
The methods match the Array signature for push, pop, unshift, and shift. For buffer
operation either use push/shift together, or unshift/pop together.

DynamicRingBuffer allocates and deallocates internal buffers as the length increases
and decreases to tolerate rare bursts of data, while using memory frugally when data
flows slow.

* `chunkSize` **[Number][11]** buffer will grow and shrink in chunkSize increments (optional, default `100`)
* `capacity` **[Number][11]** maximum number of values in the buffer (optional, default `Number.MAX_SAFE_INTEGER`)

## clear

Empties the ring buffer.

## back

Returns the value at the back of the buffer.

Returns the back of the buffer, or `undefined` if empty

## front

Returns the value at the front of the buffer.

Returns the front of the buffer, or `undefined` if empty

## push

Pushes a value onto the back of the buffer. If length === capacity,
the value at the front of the buffer is discarded.

* `value` **any** value to push

Returns current length of buffer

## pop

Removes a value from the back of the buffer and returns it. The
newly empty buffer location is set to undefined to release any
object references.

Returns the value removed from the back of the buffer
or `undefined` if empty.

## shift

Removes a value from the front of the buffer and returns it. The
newly empty buffer location is set to undefined to release any
object references.

Returns the value removed from the front of the buffer
or `undefined` if empty.

## unshift

Pushes a value on the front of the buffer. If length === capacity,
the value at the back is discarded.

* `value` **any** to push onto the front

Returns current length of buffer

## iterator

Iterator that goes from front to back.

Returns **Generator** that iterates from front to back

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
