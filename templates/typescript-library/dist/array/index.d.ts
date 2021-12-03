declare type ArrayPredicate<T> = (value: T, index: number, array: IArrayLike<T>) => value is any;
interface IArrayLike<T> {
    length: number;
    [n: number]: T;
}
/**
 * 合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
 * @param arr - 待操作数组
 * const array1 = ['a', 'b', 'c'];
 * const array2 = ['d', 'e', 'f'];
 * const array3 = array1.concat(array2); // ["a", "b", "c", "d", "e", "f"]
 */
export declare const concat: <T>(arr: T[], ...newArr: T[]) => T[];
/**
 * 浅复制数组的一部分到同一数组中的另一个位置，并返回它，不会改变原数组的长度
 * @param arr - 待操作数组
 * @param from - 复制序列到该位置，如果是负数，from 将从末尾开始计算，如果 end 大于等于 arr.length，将会不发生拷贝
 * @param start - 开始复制元素的起始位置
 * @param end - 开始复制元素的结束位置
 * @example
 * const array = ['a', 'b', 'c', 'd', 'e'];
 * array.copyWithin(0, 3, 4) // ["d", "b", "c", "d", "e"]
 */
export declare const copyWithin: <T>(arr: T[], from: number, start: number, end: number) => T[];
/**
 * 返回一个新的Array Iterator对象，该对象包含数组中每个索引的键/值对
 * @param arr - 待操作数组
 */
export declare const entries: <T>(arr: T[]) => IterableIterator<[number, T]>;
/**
 * 试一个数组内的所有元素是否都能通过某个指定函数的测试
 * @param arr - 待操作数组
 * @param predicate - 用来测试每个元素的函数
 */
export declare const every: <T, C = any>(arr: IArrayLike<T>, predicate: ArrayPredicate<T>, thisArg?: C | undefined) => boolean;
/**
 * 用一个固定值填充一个数组中从起始索引到终止索引内的全部元素
 * @example
 * const array1 = [1, 2, 3, 4];
 * array1.fill(0, 2, 4) // [1, 2, 0, 0]
 */
export declare const fill: <T>(arr: T[], value: T, start?: number | undefined, end?: number | undefined) => T[];
export declare const filter: <T, S = any>(arr: IArrayLike<T>, predicate: (value: T, index: number, array: T[]) => boolean, thisArg?: S | undefined) => IArrayLike<T>;
export declare const find: <T, C>(arr: IArrayLike<T>, callbackfn: (value: T, index: number, array: IArrayLike<T>) => unknown, thisArg?: C | undefined) => T | null;
export declare const findIndex: <T, C>(arr: IArrayLike<T>, callbackfn: (value: T, index: number, array: IArrayLike<T>) => unknown, thisArg?: C | undefined) => number;
export declare const flat: <T, D extends number>(arr: T[], deep?: D | undefined) => FlatArray<T, D>[];
export declare const flatMap: <T, C>(arr: T[], callbackfn: (this: unknown, value: T, index: number, array: T[]) => unknown, thisArg?: C | undefined) => unknown[];
export declare const forEach: <T, C = any>(arr: IArrayLike<T>, callbackfn: (value: T, index: number, array: IArrayLike<T>) => void, thisArg?: C | undefined) => void;
export declare const from: <T, C>(arr: Iterable<T> | IArrayLike<T>, callbackfn: (v: unknown, k: number) => unknown, thisArg?: C | undefined) => unknown[];
export declare const includes: <T>(arr: T[], value: T, fromIndex?: number | undefined) => boolean;
export declare const indexOf: <T>(arr: IArrayLike<T>, searchElement: T, fromIndex?: number | undefined) => number;
export declare const join: <T>(arr: T[], separator?: string | undefined) => string;
export declare const keys: <T>(arr: T[]) => IterableIterator<number>;
export declare const lastIndexOf: <T>(arr: IArrayLike<T>, searchElement: T, fromIndex?: number | undefined) => number;
export declare const map: <T, S = any>(arr: T[], callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: S | undefined) => T[];
export declare const pop: <T>(arr: T[]) => T | undefined;
export declare const push: <T>(arr: T[], ...items: T[]) => number;
export declare const reduce: <T>(arr: T[], callbackfn: (previousValue: unknown, currentValue: any, currentIndex: number, array: T[]) => T, initialValue: T) => unknown;
export declare const reduceRight: <T>(arr: T[], callbackfn: (previousValue: unknown, currentValue: any, currentIndex: number, array: T[]) => T, initialValue: T) => unknown;
export declare const reverse: <T>(arr: T[]) => T[];
/**
 * 数组中删除第一个元素，并返回该元素的值
 */
export declare const shift: <T>(arr: T[]) => T;
export declare const slice: <T>(arr: T[], begin?: number | undefined, end?: number | undefined) => T[];
export declare const some: <T, S = any>(arr: T[], predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: S | undefined) => boolean;
export {};
