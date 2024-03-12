function hasCyclicReferences(obj, seen = new WeakSet()) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }

    if (seen.has(obj)) {
        return true;
    }

    seen.add(obj);

    for (let key in obj) {
        if (obj.hasOwnProperty(key) && hasCyclicReferences(obj[key], seen)) {
            return true;
        }
    }

    return false;
}

function stringify(param) {
    if (
        param instanceof Number ||
        param instanceof String ||
        param instanceof Boolean
    ) {
        return stringify(param.valueOf());
    } else if (param === Infinity || Number.isNaN(param)) {
        return 'null';
    } else if (
        typeof param === 'number' ||
        typeof param === 'boolean' ||
        param === null
    ) {
        return String(param);
    } else if (typeof param === 'string') {
        const specialSymbol = {
            '\\': '\\\\',
            '\n': '\\n',
            '\t': '\\t',
            '\r': '\\r',
            '\f': '\\f',
            '\b': '\\b',
            '"': '\\"',
        };
        const str = param.replace(
            /[\n\t\r\f\b\\"]/g,
            (match) => specialSymbol[match]
        );
        return `"${str}"`;
    } else if (typeof param === 'function' || typeof param === 'undefined') {
        return undefined;
    } else if (Array.isArray(param)) {
        const arrayValues = param.map((item) => {
            if (typeof item === 'function' || typeof item === 'undefined') {
                return 'null';
            } else {
                return stringify(item);
            }
        });
        return '[' + arrayValues.join(',') + ']';
    } else if (param instanceof Date) {
        return '"' + param.toISOString() + '"';
    } else if (typeof param === 'object') {
        if (hasCyclicReferences(param)) {
            throw new TypeError(
                'TypeError: Converting circular structure to JSON'
            );
        }
        const objectProperties = [];
        for (const [key, val] of Object.entries(param)) {
            if (
                param.hasOwnProperty(key) &&
                val !== undefined &&
                typeof val !== 'function' &&
                !(typeof val === 'symbol')
            ) {
                objectProperties.push(`"${key}":${stringify(param[key])}`);
            }
        }
        return '{' + objectProperties.join(',') + '}';
    } else if (typeof param === 'bigint') {
        throw new TypeError(
            "TypeError: BigInt value can't be serialized in JSON"
        );
    } else {
        return 'null';
    }
}

module.exports = stringify;
