import * as os from 'node:os';
import { threadSort } from './ParallelSort';

// Generación de un arreglo aleatorio
function generateRandomArray(size: number): number[] {
    const array: number[] = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 1000000)); // Limitar los valores
    }
    return array;
}

// Implementación nativa de mergeSort
function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

// Función de fusión para mergeSort
function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Comparar las implementaciones
const sizes = [1000000, 5000000, 100000000]; // Diferentes tamaños de arrays para probar
(async () => {
    for (const size of sizes) {
        const array = generateRandomArray(size);

        // Benchmark para la implementación de worker threads
        console.time(`threadSort (worker_threads) - size ${size}`);
        await threadSort(array);
        console.timeEnd(`threadSort (worker_threads) - size ${size}`);

        // Benchmark para la implementación nativa de mergeSort
        console.time(`mergeSort (native) - size ${size}`);
        mergeSort(array);
        console.timeEnd(`mergeSort (native) - size ${size}`);

        // Benchmark para la implementación nativa de Array.sort
        console.time(`Array.sort (native) - size ${size}`);
        array.sort((a, b) => a - b); // Usando el comparador numérico
        console.timeEnd(`Array.sort (native) - size ${size}`);
    }
})();
