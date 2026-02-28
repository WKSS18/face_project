import { useEffect } from "react";

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
    return (
        <div>迭代器</div>
    )
}

export default Generator;