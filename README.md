# DynamicRingBuffer

DynamicRingBuffer implements classic fixed length ring buffer, or circular queue. Memory is dynamically allocated and deallocated in chunks as the buffer grows and shrinks. This allows the buffer to have a large capacity to handle data bursts, while minimizing memory use during normal operation.

When the buffer length reaches capacity, the oldest values are quietly thrown away. The methods match the Array signature for push, pop, unshift, and shift. For buffer operation either use push/shift together, or unshift/pop together.

There are lots of ring buffer implementations on NPM. This implementation:

* Dynamically allocates and deallocates in chunks to reduce memory use when not needed.
* Drop in replacement for `Array` to convert a buffer to a ring buffer.
* Provides `module` property in `package.json` pointing to the ES module for bundlers.
* Requires no compiler since it uses [esm](https://github.com/standard-things/esm) to provide the NPM module.
* Provides `Symbol.iterator` generator.

## Installation

```bash
npm install --save @toolbuilder/dynamic-ring-buffer
```

## Getting Started

The API documentation is [here](docs/dynamic-ring-buffer.md).  This is a quick example to get you started.

```javascript
import { DynamicRingBuffer } from '@toolbuilder/dynamic-ring-buffer'
const log = console.log

const ringBuffer = new DynamicRingBuffer(100, 10000) // max length 10000 in chunks of 100
log(ringBuffer.length) // prints 0

['A', 'B', 'C'].forEach(x => ringBuffer.push(x))
log(ringBuffer.length) // prints 3
log(ringBuffer.front()) // prints 'A'
log(ringBuffer.back()) // prints 'C'
log(ringBuffer.shift()) // prints 'A'
log(ringBuffer.length) // prints 2
log([...ringBuffer]) // prints ['A', 'B']
log(ringBuffer.length) // prints 2
```

## Alternatives

There are **lots** of alternatives on npm.

## Contributing

Contributions are welcome. Please create a pull request.

I use [pnpm](https://pnpm.js.org/) instead of npm, which is why `pnpm-lock.yaml` exists in the git repo.

## Issues

This project uses Github issues.
