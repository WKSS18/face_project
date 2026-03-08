// 判断调用对象是否为函数。
// 处理 context 为 null 或 undefined 的情况，默认指向全局对象（浏览器为 window，Node 为 global）。
// 将函数作为 context 的一个属性（使用 Symbol 防止属性名冲突）。
// 使用 context 调用该函数，并传入参数。
// 删除临时属性，返回执行结果。
Function.prototype.myCall = function (context, ...args) {
    // 1. 判断调用者是否为函数
    if (typeof this !== 'function') {
        throw new TypeError('Type Error');
    }
    // 2. 处理 context 为 null 或 undefined 的情况，指向全局对象
    // 兼容浏览器和 Node 环境
    context = context || globalThis;
    // 3. 使用 Symbol 创建唯一属性名，防止覆盖 context 原有属性
    const fnSymbol = Symbol('fn');
    // 4. 将当前函数（this）挂载到 context 上
    context[fnSymbol] = this;
    // 5. 调用函数并传入参数
    const result = context[fnSymbol](...args);
    // 6. 删除临时属性，保持 context 原始状态
    delete context[fnSymbol];
    // 7. 返回函数执行结果
    return result;
};






Function.prototype.myApply = function (context, args) {
    // 1. 判断调用者是否为函数
    if (typeof this !== 'function') {
        throw new TypeError('Type Error');
    }
    // 2. 处理 context 默认指向
    context = context || globalThis;
    // 3. 使用 Symbol 创建唯一属性名
    const fnSymbol = Symbol('fn');
    // 4. 挂载函数
    context[fnSymbol] = this;
    // 5. 处理参数：判断 args 是否存在，不存在则传空数组
    // 即使 args 不是数组，展开运算符也能处理类数组对象
    const result = context[fnSymbol](...(args || []));
    // 6. 删除属性
    delete context[fnSymbol];
    // 7. 返回结果
    return result;
};



// 返回一个新函数。
// 处理参数合并（柯里化：bind 时传的参数 + 调用时传的参数）。
// 关键点：维护原型链，使得 new 调用 bind 返回的函数时，实例能继承原函数的原型。
Function.prototype.myBind = function (context, ...args) {
    // 1. 判断调用者是否为函数
    if (typeof this !== 'function') {
        throw new TypeError('Type Error');
    }
    // 2. 保存当前函数（即调用 bind 的原函数）
    const self = this;
    // 3. 定义返回的 bound 函数
    const boundFn = function (...newArgs) {
        // 判断 boundFn 是否被 new 调用
        // 如果是 new 调用，this 指向实例；否则指向传入的 context
        // newArgs 是调用 boundFn 时传入的参数
        return self.apply(
            this instanceof boundFn ? this : context,
            [...args, ...newArgs]
        );
    };
    // 4. 维护原型链
    // 使得 instanceof 操作符有效，且实例能访问原函数原型上的属性
    // 使用 Object.create 避免修改原函数的 prototype
    boundFn.prototype = Object.create(this.prototype);
    // 5. 返回新函数
    return boundFn;
};


/**
 * @param {Function} fn - 需要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行（可选配置）
 */
function debounce(fn, delay, immediate = false) {
    let timer = null;
    // let isInvoke = false; // 标记是否已经执行过
    const _debounce = function (...args) {
        // 清除上一次的定时器
        if (timer) clearTimeout(timer);
        // 处理立即执行
        if (immediate) {
            // // 如果已经执行过，就等待时间结束；如果没执行过，立即执行
            // if (!isInvoke) {
            //     fn.apply(this, args);
            //     isInvoke = true;
            // }
            // // 设置定时器，时间到后将 isInvoke 重置为 false，允许下次立即执行
            // timer = setTimeout(() => {
            //     isInvoke = false;
            // }, delay);
        } else {
            // 非立即执行：延迟 wait 后执行 fn
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    };
    // 支持取消（可选功能）
    // _debounce.cancel = function () {
    //     if (timer) clearTimeout(timer);
    //     timer = null;
    //     isInvoke = false;
    // };
    return _debounce;
}




function throttle(fn, delay) {
    let lastTime = 0; // 记录上一次执行的时间戳
    return function (...args) {
        // 获取当前时间戳
        const now = Date.now();
        // 如果当前时间距离上一次执行的时间超过了 delay
        if (now - lastTime > delay) {
            // 立即执行
            fn.apply(this, args);
            // 更新上一次执行时间
            lastTime = now;
        }
    };
}


// 实现自动柯里化
function curry(fn) {
    return function curried(...args) {
        // 如果参数够了，直接执行
        if (args.length >= fn.length) {
            console.log(this, '=1=', args)
            return fn.apply(this, args);
        }
        // 参数不够，返回新函数等待接收剩余参数
        return function (...args2) {
            console.log(this, '=2=')
            return curried.apply(this, args.concat(args2));
        };
    };
}