# 剖析 microdiff 实现原理

### 一、前言

&emsp;&emsp;microdiff 是一款对比两个对象（object or array）属性的库，相比较其它同类型的库，有以下特点：

- 包体积小于 1 kb
- 执行效率高
- 零依赖
- 支持 TypeScript

&emsp;&emsp;基本的使用方式如下：

```JavaScript
import diff from "microdiff";

const obj1 = {
	originalProperty: true,
};
const obj2 = {
	originalProperty: true,
	newProperty: "new",
};

console.log(diff(obj1, obj2));
// [{type: "CREATE", path: ["newProperty"], value: "new"}]
```

### 二、遍历对象属性

&emsp;&emsp;既然要对比两个对象的属性，那么必然需要先遍历对象的属性，JavaScript 提供了应用于各种场景的遍历方法：

- for...in
- Object.keys()
- Object.getOwnPropertyNames()
- Object.getOwnPropertySymbols()
- Reflect.ownKeys()

&emsp;&emsp;要想完全掌握上述方法，可以从对象属性的两个维度着手，第一个维度就是属性类型：

```JavaScript
const obj = {
    foo: 'foo',
    bar: 20,
}

Object.prototype.bzz = 'bzz';

console.log(obj.bzz); // bzz

obj[Symbol('far')] = 'far'; // [Symbol(far)]: 'far'
```

&emsp;&emsp;由于 JavScript 的原型链机制以及 ES6 新增的 Symbol 基本数据类型，使得属性按照类型可以分为：

- 自身属性
- 继承属性
- Symbol 属性

&emsp;&emsp;属性除了自身的 value 之外，还有三个特殊的特性，统称为属性描述符：

```JavaScript

Object.getOwnPropertyDescriptors(obj)

{
  foo: {
    value: 'foo',
    writable: true,
    enumerable: true,
    configurable: true
  },
  bar: { value: 20, writable: true, enumerable: true, configurable: true },
  [Symbol(far)]: {
    value: 'far',
    writable: true,
    enumerable: true,
    configurable: true
  }
}
```

&emsp;&emsp;通过 Object.getOwnPropertyDescriptors 方法可以获取到对象所有属性的所有描述符，而其中的 enumerable（是否可以枚举） 属性描述符就是理解遍历方法的重中之重。


&emsp;&emsp;从上图中可以看出只有 for...in 是会遍历出原型链属性的，所以早期的 JavaScript 代码中，为了避免这种情况的出现，需要这样处理：

```JavaScript
for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
        // 过滤原型链上的属性
        console.log(i);
    }
}
```

### 三、实现原理

