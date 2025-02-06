"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threadSort = void 0;
var node_worker_threads_1 = require("node:worker_threads");
var os = require("node:os");
// Optimized merge function using direct array manipulation
function merge(left, right) {
    var result = new Array(left.length + right.length);
    var i = 0;
    var j = 0;
    var k = 0;
    while (i < left.length && j < right.length) {
        result[k++] = left[i] < right[j] ? left[i++] : right[j++];
    }
    while (i < left.length)
        result[k++] = left[i++];
    while (j < right.length)
        result[k++] = right[j++];
    return result;
}
// Optimized in-place quicksort for worker chunks
function quickSort(arr, left, right) {
    var _a;
    if (left === void 0) { left = 0; }
    if (right === void 0) { right = arr.length - 1; }
    if (left >= right)
        return;
    var pivot = arr[Math.floor((left + right) / 2)];
    var i = left;
    var j = right;
    while (i <= j) {
        while (arr[i] < pivot)
            i++;
        while (arr[j] > pivot)
            j--;
        if (i <= j) {
            _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
            i++;
            j--;
        }
    }
    if (left < j)
        quickSort(arr, left, j);
    if (i < right)
        quickSort(arr, i, right);
}
// Determine optimal chunk size based on array size
function getOptimalChunkSize(arrayLength, cpuCount) {
    var baseChunkSize = Math.ceil(arrayLength / cpuCount);
    // For smaller arrays, use fewer workers to reduce overhead
    if (arrayLength < 1000000) {
        return Math.ceil(arrayLength / Math.min(cpuCount, 4));
    }
    return baseChunkSize;
}
function threadSort(array) {
    var cpus = os.cpus().length;
    var chunkSize = getOptimalChunkSize(array.length, cpus);
    var chunks = [];
    // Pre-allocate chunks to avoid resizing
    var numChunks = Math.ceil(array.length / chunkSize);
    for (var i = 0; i < numChunks; i++) {
        var start = i * chunkSize;
        var end = Math.min(start + chunkSize, array.length);
        // Create chunks with typed arrays for better performance
        chunks.push(new Float64Array(array.slice(start, end)));
    }
    var workerPromises = chunks.map(function (chunk) {
        return new Promise(function (resolve, reject) {
            var worker = new node_worker_threads_1.Worker(__filename, {
                workerData: chunk
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', function (code) {
                if (code !== 0)
                    reject(new Error("Worker stopped with exit code ".concat(code)));
            });
        });
    });
    return Promise.all(workerPromises).then(function (initialChunks) {
        // Optimize merge phase using a balanced binary merge
        var mergedChunks = initialChunks;
        while (mergedChunks.length > 1) {
            var newChunks = [];
            for (var i = 0; i < mergedChunks.length; i += 2) {
                if (i + 1 < mergedChunks.length) {
                    newChunks.push(merge(mergedChunks[i], mergedChunks[i + 1]));
                }
                else {
                    newChunks.push(mergedChunks[i]);
                }
            }
            mergedChunks = newChunks;
        }
        return mergedChunks[0];
    });
}
exports.threadSort = threadSort;
if (node_worker_threads_1.isMainThread) {
    // Main thread code
}
else {
    // Worker thread: Use quicksort instead of Array.sort
    var chunk = node_worker_threads_1.workerData;
    quickSort(chunk);
    node_worker_threads_1.parentPort === null || node_worker_threads_1.parentPort === void 0 ? void 0 : node_worker_threads_1.parentPort.postMessage(chunk);
}
