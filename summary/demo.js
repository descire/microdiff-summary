
const obj = {
    foo: 'foo',
    bar: 20,
}

Object.prototype.bzz = 'bzz';

console.log(obj.bzz); // bzz

obj[Symbol('far')] = 'far'; // [Symbol(far)]: 'far'

console.log(Object.getOwnPropertyDescriptors(obj))

for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
        console.log(i);
    }
}