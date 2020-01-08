

export type Decoder<T> = (obj: unknown, ...path: string[]) => T;

const rootPath = ['$'];

function string(obj: unknown, ...path: string[]): string {
    if (typeof obj !== 'string')
        throw new TypeError(`Expected a string at ${path.join('')}, got ${obj}`);
    return obj;
}

function number(obj: unknown, ...path: string[]): number {
    if (typeof obj !== 'number')
        throw new TypeError(`Expected a number at ${path.join('')}, got ${obj}`);
    return obj;
}

function boolean(obj: unknown, ...path: string[]): boolean {
    if (typeof obj !== 'boolean')
        throw new TypeError(`Expected a boolean at ${path.join('')}, got ${obj}`);
    return obj;
}

function nullable<T>(decoder: Decoder<T>): Decoder<T | null> {
    return function (obj: unknown, ...path: string[]) {
        if (typeof obj == null) {
            return null;
        } else {
            return decoder(obj);
        }
    }
}

function array<T>(item: Decoder<T>): Decoder<T[]> {
    return function (obj: unknown, ...path: string[]) {
        if (!Array.isArray(obj)) {
            throw new TypeError(`Expected an array at ${(path || rootPath)}, got ${obj}`);
        }
        return obj.map((item, index) => {
            return item(item, ...path, `[${index}]`);
        });
    }
}

export type PropertyDecoder<T> = (properties: {[k: string]: unknown}, ...path: string[]) => T;

function isObject(obj: unknown): obj is {[k: string]: any} {
    return typeof obj === 'object' &&
            obj != null &&
            !Array.isArray(obj);
}

function object<T>(properties: PropertyDecoder<T>): Decoder<T> {
    return function (obj: unknown, ...path: string[]) {
        if (!isObject(obj)) {
            throw new TypeError(`Expected an object at ${path.join(',')}, got ${obj}`);
        }
        return properties(obj, ...path, '.');
    };
}

export interface SelectDecoder<T> {
    ifBoolean: Decoder<T>;
    ifNumber: Decoder<T>;
    ifString: Decoder<T>;
    ifArray: Decoder<T>;
    ifObject: Decoder<T>;
}

function union<T>(select: SelectDecoder<T>): Decoder<T> {
    return function (json: unknown, ...path: string[]) {
        path = path || rootPath;
        let acceptTypes = [];
        if (select.ifBoolean) {
            if (typeof json === 'boolean') { return select.ifBoolean(json, ...path); }
            acceptTypes.push('boolean');
        }
        if (select.ifNumber) {
            if (typeof json === 'number') { return select.ifNumber(json, ...path); }
            acceptTypes.push('number');
        }
        if (select.ifString) {
            if (typeof json === 'string') { return select.ifString(json, ...path); }
            acceptTypes.push('string');
        }
        if (select.ifArray) {
            if (Array.isArray(json)) { return select.ifArray(json, ...path); }
            acceptTypes.push('object');
        }
        if (select.ifObject) {
            if (isObject(json)) { return select.ifObject(json, ...path); }
            acceptTypes.push('object');
        }
        acceptTypes = acceptTypes.map(type => `'${type}'`);
        throw new Error(`Unexpected type. Expected '${acceptTypes.join(' | ')}' at ${path.join('')}`);
    };
}

export default {
    boolean,
    string,
    number,
    array,
    object,
    union,
    nullable
};



