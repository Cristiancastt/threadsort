// src/Types.ts

/**
 * Tipo para el resultado de la función `parallelSort`, que es una Promesa que devuelve un arreglo de números ordenados.
 */
export type ParallelSortResult = Promise<number[]>;

/**
 * Tipo para la función `parallelSort`, que toma un arreglo de números y retorna una Promesa.
 */
export type ThreadSort = (array: number[]) => ParallelSortResult

/**
 * Tipo para la función `mergeSort`, que toma un arreglo de números y retorna un arreglo de números ordenados.
 * Esta es la versión sin paralelización.
 */
export type MergeSort = (arr: number[]) => number[]
