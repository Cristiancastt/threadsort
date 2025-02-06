import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import * as os from 'node:os';
import type { ParallelSortResult } from './Types';

// Optimized merge function using direct array manipulation
function merge(left: number[], right: number[]): number[] {
    const result = new Array(left.length + right.length);
    let i = 0;
    let j = 0;
    let k = 0;
    
    while (i < left.length && j < right.length) {
        result[k++] = left[i] < right[j] ? left[i++] : right[j++];
    }
    
    while (i < left.length) result[k++] = left[i++];
    while (j < right.length) result[k++] = right[j++];
    
    return result;
}

// Optimized in-place quicksort for worker chunks
function quickSort(arr: number[], left = 0, right = arr.length - 1) {
    if (left >= right) return;

    const pivot = arr[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
        while (arr[i] < pivot) i++;
        while (arr[j] > pivot) j--;
        
        if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
            j--;
        }
    }

    if (left < j) quickSort(arr, left, j);
    if (i < right) quickSort(arr, i, right);
}

// Determine optimal chunk size based on array size
function getOptimalChunkSize(arrayLength: number, cpuCount: number): number {
    const baseChunkSize = Math.ceil(arrayLength / cpuCount);
    // For smaller arrays, use fewer workers to reduce overhead
    if (arrayLength < 1000000) {
        return Math.ceil(arrayLength / Math.min(cpuCount, 4));
    }
    return baseChunkSize;
}

export function threadSort(array: number[]): ParallelSortResult {
    const cpus = os.cpus().length;
    const chunkSize = getOptimalChunkSize(array.length, cpus);
    const chunks: number[][] = [];
    
    // Pre-allocate chunks to avoid resizing
    const numChunks = Math.ceil(array.length / chunkSize);
    for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, array.length);
        // Create chunks with typed arrays for better performance
        chunks.push(new Float64Array(array.slice(start, end)) as unknown as number[]);
    }

    const workerPromises = chunks.map((chunk) => {
        return new Promise<number[]>((resolve, reject) => {
            const worker = new Worker(__filename, {
                workerData: chunk
            });
            
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    });

    return Promise.all(workerPromises).then((initialChunks) => {
        // Optimize merge phase using a balanced binary merge
        let mergedChunks = initialChunks;
        while (mergedChunks.length > 1) {
            const newChunks: number[][] = [];
            for (let i = 0; i < mergedChunks.length; i += 2) {
                if (i + 1 < mergedChunks.length) {
                    newChunks.push(merge(mergedChunks[i], mergedChunks[i + 1]));
                } else {
                    newChunks.push(mergedChunks[i]);
                }
            }
            mergedChunks = newChunks;
        }
        return mergedChunks[0];
    });
}

if (isMainThread) {
    // Main thread code
} else {
    // Worker thread: Use quicksort instead of Array.sort
    const chunk = workerData as number[];
    quickSort(chunk);
    parentPort?.postMessage(chunk);
}