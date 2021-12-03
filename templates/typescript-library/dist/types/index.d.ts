export declare const getType: (obj: any) => string;
export declare const isWindow: (obj: unknown) => obj is Window;
export declare const isHTMLElement: (obj: any) => obj is HTMLElement;
export declare const isFn: (obj: unknown) => obj is (...args: any[]) => any;
export declare const isArr: (arg: any) => arg is any[];
export declare const isPlainObj: (obj: unknown) => obj is Record<string, unknown>;
export declare const isStr: (obj: unknown) => obj is string;
export declare const isBool: (obj: unknown) => obj is boolean;
export declare const isNum: (obj: unknown) => obj is number;
export declare const isObj: (val: unknown) => val is Record<string, unknown>;
export declare const isRegExp: (obj: unknown) => obj is RegExp;
export declare const isMap: (obj: unknown) => obj is Map<any, any>;
export declare const isWeakMap: (obj: unknown) => obj is WeakMap<any, any>;
export declare const isSet: (obj: unknown) => obj is Set<any>;
export declare const isWeakSet: (obj: unknown) => obj is WeakSet<any>;
export declare const isSymbol: (obj: unknown) => obj is symbol;
export declare const isNull: (val: any) => boolean;
export declare const isUndefined: (val: any) => boolean;
export declare const isDef: (val: any) => boolean;
export declare const isUnDef: (val: any) => boolean;
