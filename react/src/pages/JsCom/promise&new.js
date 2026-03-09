/**
 * 符合 Promise/A+ 规范的手写 Promise 实现
 * 支持完整的状态管理、链式调用、错误处理等特性
 */

// Promise 的三种状态常量
const PENDING = 'pending'; // 初始状态，既不是成功也不是失败
const FULFILLED = 'fulfilled'; // 操作成功完成的状态
const REJECTED = 'rejected'; // 操作失败的状态

class MyPromise {
    /**
     * 构造函数
     * @param {Function} executor - 执行器函数，立即执行，接收 resolve 和 reject 参数
     */
    constructor(executor) {
        // 初始化状态为 pending
        this.status = PENDING;
        // 成功时的值
        this.value = undefined;
        // 失败时的原因
        this.reason = undefined;
        // 存储成功的回调函数数组（处理异步情况）
        this.onFulfilledCallbacks = [];
        // 存储失败的回调函数数组（处理异步情况）
        this.onRejectedCallbacks = [];

        /**
         * resolve 函数 - 将 promise 状态从未决状态变为已决状态（成功）
         * @param {*} value - 成功的值
         */
        const resolve = (value) => {
            // 只有在 pending 状态才能改变状态（状态只能改变一次）
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                // 执行所有存储的成功回调
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };

        /**
         * reject 函数 - 将 promise 状态从未决状态变为已决状态（失败）
         * @param {*} reason - 失败的原因
         */
        const reject = (reason) => {
            // 只有在 pending 状态才能改变状态（状态只能改变一次）
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                // 执行所有存储的失败回调
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            // 立即执行执行器函数
            executor(resolve, reject);
        } catch (error) {
            // 如果执行器函数抛出异常，直接调用 reject
            reject(error);
        }
    }

    /**
     * then 方法 - 注册成功和失败的回调函数
     * @param {Function} onFulfilled - 成功回调
     * @param {Function} onRejected - 失败回调
     * @returns {MyPromise} 新的 Promise 实例，支持链式调用
     */
    then(onFulfilled, onRejected) {
        // 参数可选，如果不是函数则忽略
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };

        // 创建新的 Promise 实例，用于链式调用
        const promise2 = new MyPromise((resolve, reject) => {
            // 封装通用的成功处理逻辑
            const fulfilledMicrotask = () => {
                // 使用 queueMicrotask 确保在微任务队列中执行（模拟原生 Promise 行为）
                queueMicrotask(() => {
                    try {
                        // 获取用户注册的成功回调的返回值
                        const x = onFulfilled(this.value);
                        // 处理返回值，决定新 promise 的状态
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        // 如果回调函数执行出错，新 promise 状态变为 rejected
                        reject(error);
                    }
                });
            };

            // 封装通用的失败处理逻辑
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        // 获取用户注册的失败回调的返回值
                        const x = onRejected(this.reason);
                        // 处理返回值，决定新 promise 的状态
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        // 如果回调函数执行出错，新 promise 状态变为 rejected
                        reject(error);
                    }
                });
            };

            // 根据当前 promise 状态执行相应逻辑
            if (this.status === FULFILLED) {
                // 已成功状态，直接执行成功回调
                fulfilledMicrotask();
            } else if (this.status === REJECTED) {
                // 已失败状态，直接执行失败回调
                rejectedMicrotask();
            } else if (this.status === PENDING) {
                // pending 状态，将回调函数存储起来，等待状态确定后再执行
                this.onFulfilledCallbacks.push(fulfilledMicrotask);
                this.onRejectedCallbacks.push(rejectedMicrotask);
            }
        });

        return promise2;
    }

    /**
     * catch 方法 - 注册失败回调的语法糖
     * @param {Function} onRejected - 失败回调
     * @returns {MyPromise} 新的 Promise 实例
     */
    catch (onRejected) {
        return this.then(null, onRejected);
    }

    /**
     * finally 方法 - 注册无论成功还是失败都会执行的回调
     * @param {Function} callback - 回调函数
     * @returns {MyPromise} 新的 Promise 实例
     */
    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => {
                throw reason;
            })
        );
    }

    /**
     * resolve 静态方法 - 创建一个已成功的 Promise
     * @param {*} value - 成功的值
     * @returns {MyPromise} 成功的 Promise 实例
     */
    static resolve(value) {
        // 如果 value 是 Promise 实例，直接返回
        if (value instanceof MyPromise) {
            return value;
        }
        // 否则创建一个新的成功 Promise
        return new MyPromise(resolve => resolve(value));
    }

    /**
     * reject 静态方法 - 创建一个已失败的 Promise
     * @param {*} reason - 失败的原因
     * @returns {MyPromise} 失败的 Promise 实例
     */
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }

    /**
     * all 静态方法 - 所有 Promise 都成功才成功，有一个失败就失败
     * @param {Iterable} promises - Promise 数组
     * @returns {MyPromise} 新的 Promise 实例
     */
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const results = []; // 存储所有成功的结果
            let resolvedCount = 0; // 已完成的数量
            let promiseCount = 0; // Promise 总数

            // 处理空数组的情况
            if (promises.length === 0) {
                resolve(results);
                return;
            }

            // 遍历所有 Promise
            for (let i = 0; i < promises.length; i++) {
                promiseCount++;
                const currentPromise = MyPromise.resolve(promises[i]); // 转换为 Promise

                currentPromise.then(
                    value => {
                        results[i] = value; // 保持顺序
                        resolvedCount++; // 增加已完成计数

                        // 当所有 Promise 都完成时，resolve 结果数组
                        if (resolvedCount === promiseCount) {
                            resolve(results);
                        }
                    },
                    reason => {
                        // 一旦有一个失败，立即 reject
                        reject(reason);
                    }
                );
            }
        });
    }

    /**
     * race 静态方法 - 第一个完成的 Promise 决定结果
     * @param {Iterable} promises - Promise 数组
     * @returns {MyPromise} 新的 Promise 实例
     */
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            // 遍历所有 Promise，谁先完成就用谁的结果
            for (let i = 0; i < promises.length; i++) {
                MyPromise.resolve(promises[i]).then(resolve, reject);
            }
        });
    }

    /**
     * allSettled 静态方法 - 等待所有 Promise 完成（无论成功还是失败）
     * @param {Iterable} promises - Promise 数组
     * @returns {MyPromise} 新的 Promise 实例
     */
    static allSettled(promises) {
        return new MyPromise(resolve => {
            const results = [];
            let completedCount = 0;
            let promiseCount = 0;

            // 处理空数组的情况
            if (promises.length === 0) {
                resolve(results);
                return;
            }

            for (let i = 0; i < promises.length; i++) {
                promiseCount++;
                const currentPromise = MyPromise.resolve(promises[i]);

                currentPromise.then(
                    value => {
                        results[i] = {
                            status: 'fulfilled',
                            value
                        };
                        completedCount++;
                        if (completedCount === promiseCount) {
                            resolve(results);
                        }
                    },
                    reason => {
                        results[i] = {
                            status: 'rejected',
                            reason
                        };
                        completedCount++;
                        if (completedCount === promiseCount) {
                            resolve(results);
                        }
                    }
                );
            }
        });
    }
}

/**
 * Promise 解析过程 - 处理 then 方法的返回值
 * @param {MyPromise} promise2 - then 方法返回的新 Promise
 * @param {*} x - then 方法回调的返回值
 * @param {Function} resolve - 新 Promise 的 resolve 函数
 * @param {Function} reject - 新 Promise 的 reject 函数
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 如果返回的是同一个 Promise 对象，造成循环引用，直接 reject
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 标记是否已调用，防止多次调用
    let called = false;

    // 如果 x 是对象或函数
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            // 获取 x 的 then 方法
            const then = x.then;

            // 如果 then 是函数，说明 x 是 thenable 对象
            if (typeof then === 'function') {
                // 使用 call 调用 then 方法，避免多次取值
                then.call(
                    x,
                    y => {
                        // 成功回调
                        if (called) return; // 防止多次调用
                        called = true;
                        // 递归解析 y，直到得到普通值
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    r => {
                        // 失败回调
                        if (called) return; // 防止多次调用
                        called = true;
                        reject(r);
                    }
                );
            } else {
                // then 不是函数，直接 resolve
                resolve(x);
            }
        } catch (error) {
            // 如果取值或调用过程中出错，且还未调用过回调
            if (called) return;
            called = true;
            reject(error);
        }
    } else {
        // x 是普通值，直接 resolve
        resolve(x);
    }
}

// 导出 MyPromise 类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MyPromise;
}




















/**
 * 手写 new 操作符的实现
 * 模拟 JavaScript 中 new 关键字的行为
 */

/**
 * 方式一：基础版本实现
 * @param {Function} constructor - 构造函数
 * @param {...any} args - 构造函数参数
 * @returns {Object} 新创建的对象实例
 */
function myNew(constructor, ...args) {
    // 1. 创建一个空的普通 JavaScript 对象
    const obj = {};

    // 2. 将新对象的原型指向构造函数的 prototype 属性
    Object.setPrototypeOf(obj, constructor.prototype);

    // 3. 将构造函数的 this 绑定到新对象，并执行构造函数
    const result = constructor.apply(obj, args);

    // 4. 如果构造函数返回了一个对象，则返回该对象；否则返回新创建的对象
    return result instanceof Object ? result : obj;
}

/**
 * 方式二：增强版本实现（更严格的类型检查和错误处理）
 * @param {Function} constructor - 构造函数
 * @param {...any} args - 构造函数参数
 * @returns {Object} 新创建的对象实例
 */
function myNewEnhanced(constructor, ...args) {
    // 检查第一个参数是否为函数
    if (typeof constructor !== 'function') {
        throw new TypeError('Constructor must be a function');
    }

    // 创建一个新的对象
    const instance = Object.create(constructor.prototype);

    // 执行构造函数，绑定 this 到新创建的对象
    const result = constructor.apply(instance, args);

    // 判断构造函数的返回值是否为对象，如果是则返回该对象，否则返回新创建的对象
    return (result !== null && (typeof result === 'object' || typeof result === 'function')) ? result : instance;
}

/**
 * 方式三：最接近原生 new 行为的实现
 * @param {Function} Constructor - 构造函数
 * @param {...any} rest - 构造函数参数
 * @returns {Object} 新创建的对象实例
 */
function nativeNew(Constructor, ...rest) {
    // ES6 方式创建对象并链接原型
    const instance = Object.create(Constructor.prototype);

    // 执行构造函数，改变 this 指向
    const result = Constructor.apply(instance, rest);

    // 确定返回值类型（构造函数可能返回对象）
    return Object(result) === result ? result : instance;
}

// 测试用例
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.sayHello = function () {
    return `Hello, I'm ${this.name}, ${this.age} years old.`;
};

// 测试不同的实现方式
console.log('=== 测试 myNew ===');
const person1 = myNew(Person, 'Alice', 25);
console.log(person1); // Person { name: 'Alice', age: 25 }
console.log(person1.sayHello()); // Hello, I'm Alice, 25 years old.

console.log('\n=== 测试 myNewEnhanced ===');
const person2 = myNewEnhanced(Person, 'Bob', 30);
console.log(person2); // Person { name: 'Bob', age: 30 }
console.log(person2.sayHello()); // Hello, I'm Bob, 30 years old.

console.log('\n=== 测试 nativeNew ===');
const person3 = nativeNew(Person, 'Charlie', 35);
console.log(person3); // Person { name: 'Charlie', age: 35 }
console.log(person3.sayHello()); // Hello, I'm Charlie, 35 years old.

// 测试构造函数返回对象的情况
function Car(brand) {
    this.brand = brand;
    return {
        type: 'vehicle',
        brand
    }; // 显式返回对象
}

console.log('\n=== 测试构造函数返回对象 ===');
const car1 = myNew(Car, 'Tesla');
console.log(car1); // { type: 'vehicle', brand: 'Tesla' }

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        myNew,
        myNewEnhanced,
        nativeNew
    };
}