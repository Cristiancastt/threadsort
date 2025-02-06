# ThreadSort
A parallel sorting implementation that efficiently processes large datasets through concurrent execution.

> Super fast array sort method.

**ThreadSort** is a super fast array sort method that uses the power of Web Workers to sort large arrays in parallel.

## Features

- ⚡ Fast (see benchmark) +(~)50% faster than native `Array.sort`
- 🐦 Lightweight (~18kb)
- ✏ Written in TypeScript
- 📦 Zero dependencies
- 🌐 Works in Node.js and browsers

## Usage

```javascript
import { threadSort } from 'threadsort';

const array = [3, 1, 2];

const sortedArray = await threadSort(array);
```

## Benchmark

`npm run benchmark` (see `src/Benchmark.ts`)

```
Sorting arrays of sizes = [1000000, 5000000, 10000000]

threadsort (worker_threads) - size 1000000: 225.787ms
mergeSort (native) - size 1000000: 617.442ms
Array.sort (native) - size 1000000: 227.572ms

threadsort (worker_threads) - size 5000000: 506.851ms
mergeSort (native) - size 5000000: 2.960s
Array.sort (native) - size 5000000: 1.212s

threadsort (worker_threads) - size 10000000: 1.055s
mergeSort (native) - size 10000000: 7.488s
Array.sort (native) - size 10000000: 2.876s

threadsort (worker_threads) - size 100000000: 29.085s
mergeSort (native) - size 100000000: - (to slow 💀)
Array.sort (native) - size 100000000: 59.238s
```

## Key Features
- Distributes sorting workload across multiple threads
- Optimizes performance for large data collections
- Implements merge-sort algorithm in parallel
- Thread-safe execution

## Performance
Offers improved sorting speed on multi-core systems, particularly for:
- Large arrays
- Complex data structures
- Memory-intensive sorting operations

## Usage Considerations
- Best for datasets larger than 100,000 elements
- Requires proper thread management
- Memory overhead due to concurrent operations
- May not be optimal for small datasets due to threading overhead

## Notes
Performance gains depend on:
- Available CPU cores
- Data size
- Memory constraints
- System load

MIT - [Cristiancast](https://github.com/Cristiancastt)
