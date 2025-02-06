"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ParallelSort_1 = require("./ParallelSort");
// Generación de un arreglo aleatorio
function generateRandomArray(size) {
    var array = [];
    for (var i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 1000000)); // Limitar los valores
    }
    return array;
}
// Implementación nativa de mergeSort
function mergeSort(arr) {
    if (arr.length <= 1)
        return arr;
    var mid = Math.floor(arr.length / 2);
    var left = mergeSort(arr.slice(0, mid));
    var right = mergeSort(arr.slice(mid));
    return merge(left, right);
}
// Función de fusión para mergeSort
function merge(left, right) {
    var result = [];
    var i = 0;
    var j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        }
        else {
            result.push(right[j]);
            j++;
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}
// Comparar las implementaciones
var sizes = [1000000, 5000000, 100000000]; // Diferentes tamaños de arrays para probar
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, sizes_1, size, array;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _i = 0, sizes_1 = sizes;
                _a.label = 1;
            case 1:
                if (!(_i < sizes_1.length)) return [3 /*break*/, 4];
                size = sizes_1[_i];
                array = generateRandomArray(size);
                // Benchmark para la implementación de worker threads
                console.time("threadSort (worker_threads) - size ".concat(size));
                return [4 /*yield*/, (0, ParallelSort_1.threadSort)(array)];
            case 2:
                _a.sent();
                console.timeEnd("threadSort (worker_threads) - size ".concat(size));
                // Benchmark para la implementación nativa de mergeSort
                console.time("mergeSort (native) - size ".concat(size));
                mergeSort(array);
                console.timeEnd("mergeSort (native) - size ".concat(size));
                // Benchmark para la implementación nativa de Array.sort
                console.time("Array.sort (native) - size ".concat(size));
                array.sort(function (a, b) { return a - b; }); // Usando el comparador numérico
                console.timeEnd("Array.sort (native) - size ".concat(size));
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); })();
