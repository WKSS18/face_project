import { useEffect, useMemo } from "react";
import CssDom from './css'
import { Button } from "antd";
const Generator = () => {

    //     // function* numberG(a) {
    //     //     console.log(a)
    //     //     yield a;
    //     //     yield 2;
    //     //     yield 4;
    //     //     return 'done'
    //     // }

    //     // 入参
    //     function ceshi(initValue) {
    //         let exteralValue = initValue

    //         return function* numberG() {
    //             let lastValue = exteralValue
    //             while (true) {
    //                 const newValue = yield lastValue
    //                 if (!newValue) break;
    //                 lastValue = newValue * 2 + exteralValue
    //                 exteralValue = lastValue
    //             }
    //         }
    //     }


    //     /**
    //  * 生成器函数：动态数据处理器
    //  * 逻辑：
    //  * 1. 等待接收配置 (config)
    //  * 2. 基于配置处理第一批数据
    //  * 3. 等待接收下一批数据
    //  * 4. 继续处理并返回结果
    //  */
    //     function* dataProcessor() {
    //         console.log('⚙️  [内部] 处理器已启动，等待配置...');

    //         // 【关键点 1】第一个 yield 没有任何返回值给外部，专门用来“接收”配置
    //         // 当外部调用 next(config) 时，config 会赋值给这里的 config 变量
    //         const config = yield;

    //         console.log(`✅ [内部] 配置已接收:`, config);
    //         const { multiplier, prefix } = config;

    //         // --- 第一阶段处理 ---
    //         console.log(`\n📝 [内部] 正在等待第一批数据...`);

    //         // 【关键点 2】产出信号，暂停，等待外部传入第一批数据
    //         // 外部的 next(data) 中的 data 会赋值给 batch1
    //         const batch1 = yield 'READY_FOR_BATCH_1';
    //         console.log(batch1, '--=')

    //         const result1 = new Array(3).fill(1).map(num => `${prefix}-${num * multiplier}`);
    //         console.log(`🔄 [内部] 第一批处理完成:`, result1);

    //         // --- 第二阶段处理 ---
    //         console.log(`\n📝 [内部] 正在等待第二批数据...`);

    //         // 产出信号，暂停，等待外部传入第二批数据
    //         const batch2 = yield 'READY_FOR_BATCH_2';

    //         const result2 = new Array(2).fill(2).map(num => `${prefix}-${num * multiplier}`);
    //         console.log(`🔄 [内部] 第二批处理完成:`, result2);

    //         return { status: 'SUCCESS', totalProcessed: result1.length + result2.length };
    //     }

    //     // ==========================================
    //     // 外部调用逻辑 (模拟主程序)
    //     // ==========================================

    //     console.log('=== 🚀 开始执行流程 ===\n');

    //     // 1. 创建迭代器
    //     const processor = dataProcessor();

    //     // 2. 【核心技巧：预执行 (Priming)】
    //     // 第一次调用 next() **不带参数**。
    //     // 目的：让代码运行到第一个 `yield` 处暂停，准备好接收变量，但不消耗任何传入值。
    //     console.log('👉 步骤 1: 预执行 (启动并暂停在配置接收点)');
    //     processor.next();
    //     // 此时控制台输出: "⚙️ [内部] 处理器已启动，等待配置..."
    //     // 代码停在了 `const config = yield;` 这一行


    //     // 3. 传入配置
    //     // 现在调用 next(config)，这个 config 会被赋值给上面的 `const config`
    //     const myConfig = { multiplier: 10, prefix: 'ID' };
    //     console.log(`\n👉 步骤 2: 传入配置`, myConfig);
    //     const step1 = processor.next(myConfig);

    //     // 检查状态：应该停在 'READY_FOR_BATCH_1'
    //     console.log('🤖 机器状态:', step1.value);
    //     // 此时控制台内部已打印配置接收信息和第一批等待信息


    //     // 4. 传入第一批数据
    //     console.log(`\n👉 步骤 3: 传入第一批数据 `);
    //     const step2 = processor.next();

    //     // 检查状态：应该停在 'READY_FOR_BATCH_2'
    //     console.log('🤖 机器状态:', step2.value);
    //     // 此时控制台内部已打印第一批处理结果


    //     // 5. 传入第二批数据
    //     console.log(`\n👉 步骤 4: 传入第二批数据 `);
    //     const finalResult = processor.next();

    //     // 6. 获取最终结果
    //     console.log('\n🏁 最终结果:', finalResult.value);
    //     console.log('✅ 流程结束:', finalResult.done);


    //     // function* flow() {
    //     //     yield

    //     //     const config = yield(config)


    //     // }

    //     useEffect(() => {
    //         const test = ceshi(10)()
    //         console.log(test.next(), '==')
    //         console.log(test.next(10), '=0=')
    //         console.log(test.next(20), '===')
    //         console.log(test.next())
    //     }, [])


    //     function obj() {
    //         console.log(this, '====obj====')
    //     }
    //     console.log(obj(), '====')

    //     const obj1 = {
    //         a: function () {
    //             console.log(this, '===obj1==')
    //         },
    //         b: () => {
    //             console.log(this, '====obj1-1')
    //         }
    //     }
    //     const fn = obj1.a
    //     fn()
    //     obj1.a()
    //     obj1.b()

    console.log(Object.create({ age: 2 }), Object.assign({ name: 1 }))

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

    // 面试题场景：实现 add(1)(2)(3) = 6
    function add(a, b, c) {
        return a + b + c;
    }

    const curriedAdd = curry(add);

    console.log(curriedAdd(1)(2)(3)); // 6
    console.log(curriedAdd(1, 2)(3)); // 6 (支持多参数调用)


    function* generate() {
        const initV = yield 1
        console.log('===1===', initV)
        const d = yield 2 + initV
        console.log('====2===', d)
        const t = yield 3
        console.log('======3=====', t)
    }

    const d = generate()
    console.log(d.next(), d.next(55), d.next(66), d.next(77))
    console.log(/['a']/.test('abc'), '==45==', new RegExp('a') instanceof RegExp)



    Function.prototype.myCall = function (context, ...args) {
        // 1. 判断调用者是否为函数
        if (typeof this !== 'function') {
            throw new TypeError('Type Error');
        }
        console.log(context, '====context====', this, args)
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


    function zCall(...args) {
        console.log(this, '====zCall====', args)
    }
    const objCall = {
        name: 1
    }
    zCall.myCall(objCall, 2, 3)




    function Person(...args) {
        this.name = 'Person'
        console.log(this, ',====Person====', args, this instanceof Person)
    }
    const person = new Person()
    console.log(person, '====person2====', person instanceof Person)



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

    function zThrottle(...args) {
        console.log(this, '====zThrottle====', args)
    }



    throttle(zThrottle, 1000)(4, 5, 6)



    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        }
    }

    function zDebounce(...args) {
        console.log(this, '====zDebounce====', args)
    }
    const handleDebounce = useMemo(() => debounce(zDebounce, 1000), [])



    function fnT() {
        console.log(this, '====fnT====')
    }
    fnT()

    const obj = {
        a: function () {
            console.log(this, '====obj.a====')
        },
        b: () => {
            console.log(this, '====obj.b====')
        }
    }

    obj.a();
    obj.b();

    console.log(['3', 5].indexOf(5), ['3', 5].includes(5))
    for (let i in { name: 2, age: 4 }) {
        console.log(i, '====in====')
    }
    for (let key of ['3', 5]) {
        console.log(key, '====of====')
    }
    return (
        <div>
            <CssDom />
            <Button onClick={() => handleDebounce(11, 22, 33)}>点击</Button>
        </div>
    )
}

export default Generator;