const stringify = require('./stringify');

test('stringify numbers', () => {
    expect(stringify(42)).toEqual('42');
});
test('stringify string', () => {
    expect(stringify('string')).toEqual('"string"');
});

test('stringify function as undefined', () => {
    expect(stringify(() => {})).toEqual(undefined);
});

test('stringify boolean', () => {
    expect(stringify(true)).toEqual('true');
});

test('stringify Infinity as null', () => {
    expect(stringify(Infinity)).toEqual('null');
});

test('stringify undefined', () => {
    expect(stringify(undefined)).toEqual(undefined);
});

test('stringify object with nested values', () => {
    expect(
        stringify({ a: [1, 'hi', undefined, Symbol(), {}], b: undefined })
    ).toEqual('{"a":[1,"hi",null,null,{}]}');
});

test('stringify object with various properties', () => {
    expect(
        JSON.stringify({
            sayHi() {
                // будет пропущено
                alert('Hello');
            },
            [Symbol('id')]: 123, // также будет пропущено
            something: undefined, // как и это - пропущено
        })
    ).toEqual('{}');
});

test('stringify empty object', () => {
    expect(stringify({})).toEqual('{}');
});

test('stringify boolean true', () => {
    expect(stringify(true)).toEqual('true');
});

test('stringify string', () => {
    expect(stringify('foo')).toEqual('"foo"');
});

test('stringify array', () => {
    expect(stringify([1, 'false', false])).toEqual('[1,"false",false]');
});

test('stringify array with special numbers', () => {
    expect(stringify([NaN, null, Infinity])).toEqual('[null,null,null]');
});

test('stringify object with single property', () => {
    expect(stringify({ x: 5 })).toEqual('{"x":5}');
});

test('stringify date object', () => {
    expect(stringify(new Date(1906, 0, 2, 15, 4, 5))).toEqual(
        '"1906-01-02T15:04:05.000Z"'
    );
});

test('stringify object with multiple properties', () => {
    expect(stringify({ x: 5, y: 6 })).toEqual('{"x":5,"y":6}');
});

test('stringify array of wrapped primitives', () => {
    expect(
        stringify([new Number(3), new String('false'), new Boolean(false)])
    ).toEqual('[3,"false",false]');
});

test('stringify array with non-enumerable string-keyed property', () => {
    const a = ['foo', 'bar'];
    a['baz'] = 'quux';
    expect(stringify(a)).toEqual('["foo","bar"]');
});

test('stringify object with array containing undefined, function, and symbol', () => {
    expect(
        stringify({ x: [10, undefined, function () {}, Symbol('')] })
    ).toEqual('{"x":[10,null,null,null]}');
});

test('stringify standard data structures', () => {
    expect(
        stringify([
            new Set([1]),
            new Map([[1, 2]]),
            new WeakSet([{ a: 1 }]),
            new WeakMap([[{ a: 1 }, 2]]),
        ])
    ).toEqual('[{},{},{},{}]');
});

test('stringify typed arrays', () => {
    expect(
        stringify([
            new Int8Array([1]),
            new Int16Array([1]),
            new Int32Array([1]),
        ])
    ).toEqual('[{"0":1},{"0":1},{"0":1}]');

    expect(
        stringify([
            new Uint8Array([1]),
            new Uint8ClampedArray([1]),
            new Uint16Array([1]),
            new Uint32Array([1]),
        ])
    ).toEqual('[{"0":1},{"0":1},{"0":1},{"0":1}]');

    expect(stringify([new Float32Array([1]), new Float64Array([1])])).toEqual(
        '[{"0":1},{"0":1}]'
    );
});

test('stringify object with undefined, Object, and Symbol properties', () => {
    expect(stringify({ x: undefined, y: Object, z: Symbol('') })).toEqual('{}');
});

test('stringify object with Symbol property', () => {
    expect(stringify({ [Symbol('foo')]: 'foo' })).toEqual('{}');
});

test('stringify object with Symbol property using symbol key', () => {
    expect(
        stringify({ [Symbol.for('foo')]: 'foo' }, [Symbol.for('foo')])
    ).toEqual('{}');
});

test('stringify string', () => {
    expect(stringify('cwcwe/ncfwc')).toEqual('"cwcwe/ncfwc"');
});

test('stringify object with circular reference', () => {
    const abc = {
        a: 55,
        b: 'aaaaaaaa\ndhdh',
        c: () => {},
        d: { a: 1, b: 'eeee' },
        k: null,
        g: undefined,
        e: [1, 2, 2, null, undefined],
    };
    abc.abc = abc;
    expect(() => stringify(abc)).toThrowError(
        'Converting circular structure to JSON'
    );
});

test('stringify object with BigInt value', () => {
    const obj = { x: 2n };
    expect(() => stringify(obj)).toThrowError(TypeError);
});
