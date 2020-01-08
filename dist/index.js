"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var rootPath = ['$'];
function string(obj) {
    var path = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        path[_i - 1] = arguments[_i];
    }
    if (typeof obj !== 'string')
        throw new TypeError("Expected a string at " + path.join('') + ", got " + obj);
    return obj;
}
function number(obj) {
    var path = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        path[_i - 1] = arguments[_i];
    }
    if (typeof obj !== 'number')
        throw new TypeError("Expected a number at " + path.join('') + ", got " + obj);
    return obj;
}
function boolean(obj) {
    var path = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        path[_i - 1] = arguments[_i];
    }
    if (typeof obj !== 'boolean')
        throw new TypeError("Expected a boolean at " + path.join('') + ", got " + obj);
    return obj;
}
function nullable(decoder) {
    return function (obj) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (typeof obj == null) {
            return null;
        }
        else {
            return decoder(obj);
        }
    };
}
function array(item) {
    return function (obj) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (!Array.isArray(obj)) {
            throw new TypeError("Expected an array at " + (path || rootPath) + ", got " + obj);
        }
        return obj.map(function (item, index) {
            return item.apply(void 0, __spreadArrays([item], path, ["[" + index + "]"]));
        });
    };
}
function isObject(obj) {
    return typeof obj === 'object' &&
        obj != null &&
        !Array.isArray(obj);
}
function object(properties) {
    return function (obj) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        if (!isObject(obj)) {
            throw new TypeError("Expected an object at " + path.join(',') + ", got " + obj);
        }
        return properties.apply(void 0, __spreadArrays([obj], path, ['.']));
    };
}
function union(select) {
    return function (json) {
        var path = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            path[_i - 1] = arguments[_i];
        }
        path = path || rootPath;
        var acceptTypes = [];
        if (select.ifBoolean) {
            if (typeof json === 'boolean') {
                return select.ifBoolean.apply(select, __spreadArrays([json], path));
            }
            acceptTypes.push('boolean');
        }
        if (select.ifNumber) {
            if (typeof json === 'number') {
                return select.ifNumber.apply(select, __spreadArrays([json], path));
            }
            acceptTypes.push('number');
        }
        if (select.ifString) {
            if (typeof json === 'string') {
                return select.ifString.apply(select, __spreadArrays([json], path));
            }
            acceptTypes.push('string');
        }
        if (select.ifArray) {
            if (Array.isArray(json)) {
                return select.ifArray.apply(select, __spreadArrays([json], path));
            }
            acceptTypes.push('object');
        }
        if (select.ifObject) {
            if (isObject(json)) {
                return select.ifObject.apply(select, __spreadArrays([json], path));
            }
            acceptTypes.push('object');
        }
        acceptTypes = acceptTypes.map(function (type) { return "'" + type + "'"; });
        throw new Error("Unexpected type. Expected '" + acceptTypes.join(' | ') + "' at " + path.join(''));
    };
}
exports["default"] = {
    boolean: boolean,
    string: string,
    number: number,
    array: array,
    object: object,
    union: union,
    nullable: nullable
};
