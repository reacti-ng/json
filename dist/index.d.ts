export declare type Decoder<T> = (obj: unknown, ...path: string[]) => T;
declare function string(obj: unknown, ...path: string[]): string;
declare function number(obj: unknown, ...path: string[]): number;
declare function boolean(obj: unknown, ...path: string[]): boolean;
declare function nullable<T>(decoder: Decoder<T>): Decoder<T | null>;
declare function array<T>(item: Decoder<T>): Decoder<T[]>;
export declare type PropertyDecoder<T> = (properties: {
    [k: string]: unknown;
}, ...path: string[]) => T;
declare function object<T>(properties: PropertyDecoder<T>): Decoder<T>;
export interface SelectDecoder<T> {
    ifBoolean: Decoder<T>;
    ifNumber: Decoder<T>;
    ifString: Decoder<T>;
    ifArray: Decoder<T>;
    ifObject: Decoder<T>;
}
declare function union<T>(select: SelectDecoder<T>): Decoder<T>;
declare const _default: {
    boolean: typeof boolean;
    string: typeof string;
    number: typeof number;
    array: typeof array;
    object: typeof object;
    union: typeof union;
    nullable: typeof nullable;
};
export default _default;
