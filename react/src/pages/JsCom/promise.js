class MyPromise {
    constructor(executor) {
        // 1. 初始化状态为 pending (等待中)
        this.status = 'pending';
        // 2. 初始化成功的值
        this.value = undefined;
        // 3. 初始化失败的原因
        this.reason = undefined;
        // 4. 定义两个数组，分别存储成功和失败的回调
        // 作用：处理当 Promise 状态未改变时，先执行了 .then 的情况（异步处理）
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        // 5. 定义 resolve 函数
        const resolve = (value) => {
            // 只有当前状态为 pending 时才能改变状态，保证状态不可逆
            if (this.status === 'pending') {
                this.status = 'fulfilled'; // 更新状态为成功
                this.value = value;         // 保存成功的值
                // 6. 状态改变后，依次执行缓存数组中的成功回调
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };
        // 定义 reject 函数
        const reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected'; // 更新状态为失败
                this.reason = reason;     // 保存失败原因
                // 状态改变后，依次执行缓存数组中的失败回调
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        // 7. 立即执行传入的 executor 函数
        // 如果 executor 执行过程中抛出异常，直接进入 reject 流程
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        // 8. 参数校验与默认值处理（实现值穿透和错误冒泡）
        // 如果 onFulfilled 不是函数，则创建一个函数将 value 原样返回
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        // 如果 onRejected 不是函数，则创建一个函数将 reason 抛出，让错误继续传递
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
        // 9. 链式调用的关键：创建一个新的 Promise 实例 (promise2)
        const promise2 = new MyPromise((resolve, reject) => {
            // 10. 情况一：Promise 状态已经是成功 {
            // 使用 setTimeout 模拟微任务异步调用

            if (this.status === 'fulfilled') {
                setTimeout(() => {
                    try {
                        // 执行成功回调，拿到返回值 x
                        const x = onFulfilled(this.value);
                        // 将 x 传递给下一个 promise 的 resolve 方法
                        resolve(x);
                    } catch (e) {
                        // 如果回调执行报错，捕获错误并传递给下一个 promise
                        reject(e);
                    }
                }, 0);
            }
            // 情况二：Promise 状态已经是失败 {
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        // 执行失败回调，拿到返回值 x
                        const x = onRejected(this.reason);
                        // 如果 catch 住了错误并返回了值，下一个 Promise 状态变为成功
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }

            // 11. 情况三：Promise 状态还是等待中 {
            // 将成功回调逻辑封装成函数，存入数组等待执行
            if (this.status === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value);
                            resolve(x);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                // 将失败回调逻辑封装成函数，存入数组等待执行
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason);
                            resolve(x);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        // 12. 返回新的 Promise 实例，实现链式调用
        return promise2;
    }
}

new MyPromise((resolve, reject) => {
    resolve('success')
}).then((res) => {
    console.log(res, '====')
    // return new MyPromise((resolve, reject) => { reject('err') })
})