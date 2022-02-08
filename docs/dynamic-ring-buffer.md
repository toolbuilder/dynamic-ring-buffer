<!-- pnpx documentation build src/dynamic-ring-buffer.js -f md > docs/dyanmic-ring-buffer.md -->

### Table of Contents

*   [DynamicRingBuffer][1]
    *   [Parameters][2]
    *   [length](#length)
    *   [clear][4]
    *   [back][5]
    *   [front][6]
    *   [push][7]
    *   [pop][9]
    *   [shift][10]
    *   [unshift][11]
    *   [iterator][13]

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

Parameters:

*   `chunkSize` **[number][14]** buffer will grow and shrink in chunkSize increments (optional, default `100`)
*   `capacity` **[number][14]** maximum number of values in the buffer (optional, default `Number.MAX_SAFE_INTEGER`)

### length

Property provides the current number of elements in the buffer - it's length.

### clear

Empties the ring buffer.

Returns **void**

### back

Returns the value at the back of the buffer.

Returns **Type** the back of the buffer, or `undefined` if empty

### front

Returns the value at the front of the buffer.

Returns **Type** the front of the buffer, or `undefined` if empty

### push

Pushes a value onto the back of the buffer. If length === capacity,
the value at the front of the buffer is discarded.

Parameters:

*   `value` **Type** value to push

Returns **[number][14]** current length of buffer

### pop

Removes a value from the back of the buffer and returns it. The
newly empty buffer location is set to undefined to release any
object references.

Returns **Type** the value removed from the back of the buffer
or `undefined` if empty.

### shift

Removes a value from the front of the buffer and returns it. The
newly empty buffer location is set to undefined to release any
object references.

Returns **Type** the value removed from the front of the buffer
or `undefined` if empty.

### unshift

Pushes a value on the front of the buffer. If length === capacity,
the value at the back is discarded.

Parameters:

*   `value` **Type** to push onto the front

Returns **[number][14]** current length of buffer

### iterator

Iterator that goes from front to back.

Returns **[IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)\<Type>** iterates from front to back

[1]: #dynamicringbuffer

[2]: #parameters

[4]: #clear

[5]: #back

[6]: #front

[7]: #push

[8]: #parameters-1

[9]: #pop

[10]: #shift

[11]: #unshift

[12]: #parameters-2

[13]: #iterator

[14]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
