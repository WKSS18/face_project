第一部分：JavaScript 核心与执行机制 (1-8)
1. 闭包的本质及其内存泄漏风险
问题：什么是闭包？它为什么会导致内存泄漏？如何避免？
解析：
闭包的本质是词法作用域的查找机制。当一个函数能够记住并访问所在的词法作用域，即使该函数是在当前词法作用域之外执行，这就产生了闭包。
在JS中，函数是一等公民，函数内部可以引用外部变量。
内存泄漏：在老版本IE（或不当使用）中，由于闭包引用了外部函数的活动对象（AO），导致外部函数无法被垃圾回收（GC）。
现代浏览器优化：V8引擎会进行作用域链剪裁，如果闭包未使用的变量会被识别并回收，但引用的依然不回收。
代码示例：

function getData() {
    let cache = {};
    return function(key, value) {
        if (value) cache[key] = value; // 写
        return cache[key]; // 读 - closure holds reference to 'cache'
    };
}
const closure = getData();
// 只要 closure 存在，cache 就不会被回收
// 解决：手动置空 closure = null;
javascript

复制代码
2. var、let、const 的底层区别与 TDZ
问题：详细解释暂时性死区（TDZ）及其产生原因。
解析：

var: 会进行变量提升，初始化为 undefined，挂载到 window (全局)。
let/const: 声明会被提升到块顶部，但不会初始化。从块开始到变量声明语句之间的区域，被称为“暂时性死区”。
本质原因：为了规范代码，防止在声明前使用变量。如果绑定未初始化就访问，直接抛出 ReferenceError。
const: 仅仅是保证变量指向的内存地址不变，对于引用类型（Object），属性是可以修改的（浅冻结）。
3. this 指向的四大绑定规则与优先级
问题：箭头函数的 this 是如何确定的？普通函数的绑定优先级是怎样的？
解析：
普通函数 this 指向在运行时确定。
优先级从高到低：

new 绑定：new Fn() -> 指向实例对象。
显式绑定：call/apply/bind -> 指定第一个参数。
隐式绑定：obj.fn() -> 指向 obj。
默认绑定：独立调用 fn() -> 严格模式 undefined，非严格 window。 箭头函数：没有自己的 this，它的 this 继承自外层作用域的第一个普通函数的 this（词法绑定）。call/apply 无法改变箭头函数的 this。
4. 原型链继承的多种方式及其优缺点
问题：如何实现寄生组合式继承？为什么它是完美的？
解析：

原型链继承：Child.prototype = new Parent()。缺点：引用类型属性被所有实例共享，无法传参。
构造函数继承：Parent.call(this)。缺点：无法复用父类原型上的方法。
组合继承：结合上述两种。缺点：父类构造函数调用了两次。
寄生组合继承（最佳）：
使用 Parent.call(this) 继承属性。
使用 Object.create(Parent.prototype) 创建中间原型对象，避免调用 Parent 构造函数。
function Child(name) {
    Parent.call(this, name); // 继承属性
}
Child.prototype = Object.create(Parent.prototype); // 继承方法，不调用构造函数
Child.prototype.constructor = Child; // 修正 constructor 指向
javascript

复制代码
5. 深拷贝的实现（考虑各种边界情况）
问题：如何手写一个完美的深拷贝？
解析：
需考虑：循环引用、Symbol、RegExp、Date、Map、Set、忽略原型链。

function deepClone(target, map = new WeakMap()) {
    if (target === null || typeof target !== 'object') return target;
    if (target instanceof Date) return new Date(target);
    if (target instanceof RegExp) return new RegExp(target);
    
    // 解决循环引用
    if (map.get(target)) return map.get(target);
    let cloneTarget = new target.constructor(); // 保持原型链
    map.set(target, cloneTarget);
 
    // 处理 Map 和 Set
    if (target instanceof Map) {
        target.forEach((value, key) => cloneTarget.set(deepClone(key, map), deepClone(value, map)));
        return cloneTarget;
    }
    if (target instanceof Set) {
        target.forEach(value => cloneTarget.add(deepClone(value, map)));
        return cloneTarget;
    }
 
    for (let key in target) {
        if (target.hasOwnProperty(key)) {
            cloneTarget[key] = deepClone(target[key], map);
        }
    }
    // 处理 Symbol key
    let symKeys = Object.getOwnPropertySymbols(target);
    for (let k of symKeys) {
        cloneTarget[k] = deepClone(target[k], map);
    }
    return cloneTarget;
}
javascript

复制代码
6. Event Loop 事件循环机制（宏任务与微任务）
问题：浏览器与 Node.js 的 Event Loop 有什么区别？
解析：

浏览器：
执行同步代码。
同步结束，检查微任务队列，执行完所有微任务。
执行 UI 渲染（如果有）。
取一个宏任务执行，周而复始。
Node.js：
阶段不同：Timers, Pending Callbacks, Idle/Prepare, Poll, Check, Close Callbacks。
微任务时机：每个阶段结束后会清空微任务队列（Node 11+ 改为类似浏览器的机制，但在旧版本中微任务是在各阶段之间执行的）。 关键点：process.nextTick (Node) 优先级高于 Promise.then (微任务)。
7. 模块化：CommonJS vs ES Modules
问题：CommonJS 的 require 是同步加载，为什么设计成同步？ES Module 是编译时输出接口还是运行时？
解析：

CommonJS：主要用于服务端，文件在本地磁盘，读取快，所以设计成运行时加载（同步）。它是值的拷贝，导出值变化不影响引用。
ES Module (ESM)：设计用于浏览器和服务器。它是编译时输出接口（静态分析）。它是值的动态引用，原始值变了，导入读取的值也会变。支持 tree-shaking。
8. 垃圾回收机制 (GC) - V8 引擎
问题：V8 的分代回收是什么？新生代和老生代分别用什么算法？
解析：

分代假说：大部分对象存活时间短，少部分对象常驻内存。
新生代：空间小（1-8MB）。使用 Scavenge 算法 (Cheney 算法)。将内存分为 From 和 To，存活对象复制到 To，清空 From，互换角色。
老生代：空间大。使用 标记-清除 和 标记-整理。
标记-清除：标记存活，清除死亡。会产生内存碎片。
标记-整理：标记存活，向一端移动，整理内存。解决碎片问题。
优化：V8 使用增量标记 和 并发标记 来避免全停顿 导致的页面卡顿。
第二部分：高级特性与手写代码 (9-18)
9. 手写 Promise (核心逻辑与链式调用)
问题：实现一个符合 Promise/A+ 规范的 Promise。
解析重点：

状态：pending -> fulfilled/rejected，不可逆。
then 链式调用：返回新的 Promise。
值穿透：then 参数不是函数需忽略。
异步处理：setTimeout 模拟微任务（实际用 queueMicrotask 或 MutationObserver，面试写 setTimeout 即可）。
错误处理：try...catch 捕获执行器中的错误。
10. 手写 Promise.all / Promise.race / Promise.allSettled
问题：手写 Promise.all，要求并发且按顺序返回。
解析：

Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let result = [];
        let count = 0;
        if (promises.length === 0) resolve(result);
        
        for (let i = 0; i < promises.length; i++) {
            // 防止数组元素非 Promise
            Promise.resolve(promises[i]).then(val => {
                result[i] = val; // 保持顺序
                count++;
                if (count === promises.length) resolve(result);
            }, err => {
                reject(err); // 一旦失败，立即 reject
            });
        }
    });
};
javascript

复制代码
11. 防抖与节流
问题：两者的应用场景区别？实现一个带立即执行的防抖。
解析：

防抖：动作停止后延迟执行。适合 search 搜索框。
节流：一段时间内执行一次。适合 scroll、resize。
// 防抖（立即执行版）
function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        // 第一次立即执行
        let callNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, delay);
        if (callNow) fn.apply(this, args);
    };
}
javascript

复制代码
12. 手写 call / apply / bind
问题：如何改变 this 指向并模拟实现？
解析：

核心：将函数作为对象的属性调用，执行后删除属性。
bind：返回一个新函数，需处理 new 调用的情况。
Function.prototype.myCall = function(context, ...args) {
    context = context || globalThis;
    let fn = Symbol('fn'); // 防止覆盖 context 原有属性
    context[fn] = this;
    let result = context[fn](...args);
    delete context[fn];
    return result;
};
javascript

复制代码
13. 手写 new 操作符
问题：new 做了哪四件事？
解析：

创建新对象。
新对象的 __proto__ 指向构造函数的 prototype。
将 this 指向新对象，执行构造函数代码。
判断返回值：如果是对象则返回该对象，否则返回新对象。
function myNew(constructor, ...args) {
    let obj = Object.create(constructor.prototype);
    let res = constructor.apply(obj, args);
    return res instanceof Object ? res : obj;
}
javascript

复制代码
14. 手写数组扁平化
问题：不用 flat(Infinity) 实现。
解析：

function flatten(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
// 优化版：toString 转字符串再 split (仅适用于数字)
// reduce 递归版也是常见写法
javascript

复制代码
15. 函数柯里化
问题：实现 add(1)(2)(3) = 6。
解析：

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}
javascript

复制代码
16. instanceof 的实现原理
问题：手写 instanceof。
解析：遍历原型链，直到找到 prototype 或到达 null。

function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left); // 获取 left 的原型
    let prototype = right.prototype;
    while (true) {
        if (!proto) return false;
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}
javascript

复制代码
17. 对象数组去重（根据 key）
问题：[{id:1}, {id:1}, {id:2}] 去重。
解析：利用 Map 或 Object 字典，速度快。

function unique(arr, key) {
    let map = new Map();
    return arr.filter(item => !map.has(item[key]) && map.set(item[key], 1));
}
javascript

复制代码
18. 发布订阅模式 vs 观察者模式
问题：手写 EventEmitter。
解析：

观察者：Subject 直接通知 Observer（无中间层）。
发布订阅：Event Channel 作为调度中心。
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(...args));
        }
    }
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    once(event, callback) {
        let fn = (...args) => {
            callback(...args);
            this.off(event, fn);
        };
        this.on(event, fn);
    }
}
javascript

复制代码
第三部分：ES6+ 与 现代特性 (19-26)
19. Proxy 与 Object.defineProperty 的区别
问题：Vue 3.0 为何改用 Proxy？
解析：

defineProperty：
无法直接监听数组下标变化（Vue 重写了数组方法）。
必须遍历对象所有属性（性能差）。
无法监听新增/删除属性（需 $set/$delete）。
Proxy：
拦截整个对象，13 种拦截操作（get, set, has, deleteProperty）。
性能更好（惰性代理，访问时才响应）。
缺点：不兼容 IE 浏览器。
20. 迭代器与 for...of 原理
问题：如何让一个普通对象可以使用 for...of 遍历？
解析：
对象本身没有迭代器。必须部署 [Symbol.iterator] 方法，返回一个对象（包含 next 方法）。

let obj = { a: 1, b: 2 };
obj[Symbol.iterator] = function() {
    let keys = Object.keys(this);
    let index = 0;
    return {
        next() {
            return index < keys.length ? 
                { value: [keys[index], obj[keys[index++]]], done: false } : 
                { done: true };
        }
    };
};
for (let [k, v] of obj) { console.log(k, v); }
javascript

复制代码
21. Generator 生成器与 Async/Await 的关系
问题：async/await 是 Generator 的语法糖，它做了哪些改进？
解析：

Generator：需要手动调用 .next() 才能往下执行，执行权在调用者和被调用者之间切换（协程）。
async：
内置执行器，自动执行。
更好的语义。
返回值是 Promise，便于链式调用。
await 后面可以是 Promise 或原始类型。
底层：spawn 函数，利用递归自动调用 next，处理 done 状态。
22. WeakMap 和 WeakSet 的应用场景
问题：它们和 Map/Set 的主要区别？
解析：

弱引用：键名（或值）是对象的弱引用。如果对象没有其他引用，GC 会将其回收，WeakMap 中的引用随之消失。
不可遍历：因为不知道什么时候被回收，没有 size 和 forEach。
应用：Vue 3 响应式原理中，用 WeakMap 存储 target -> deps 的映射，这样当组件销毁（无引用）时，依赖关系自动释放，防止内存泄漏。
23. ES6 Module 的循环加载处理
问题：CommonJS 和 ES Module 处理循环加载的不同逻辑。
解析：

CommonJS：加载的是值的拷贝。一旦输出，模块内部的变化不会影响这个值。如果发生循环，只执行已执行的部分（未执行部分不执行，可能导致空对象）。
ES Module：加载的是值的引用（只读）。遇到 import 命令时，生成一个只读引用。等到脚本真正执行时，再根据这个只读引用到被加载的模块中取值。因此 ES Module 支持循环加载，能动态获取最新值。
24. BigInt 与 精度丢失问题
问题：0.1 + 0.2 !== 0.3 的原因及解决方案。
解析：

原因：JS 使用 IEEE 754 双精度浮点数（64位）。二进制无法精确表示 0.1（类似 1/3），导致精度丢失。
方案：
转为整数运算：(0.1 * 10 + 0.2 * 10) / 10。
Number.EPSILON 比较误差范围。
库：decimal.js, bignumber.js。
BigInt：用于处理大整数（如 ID 超过 16 位），不能处理小数。
25. Symbol 的主要用途
问题：如何使用 Symbol 实现私有属性？
解析：
Symbol 是第七种数据类型，表示独一无二的值。

用途 1：作为对象属性名，防止属性名冲突。
用途 2：定义常量（保证唯一性）。
私有属性（假私有）：外部无法通过 obj[key] 或 for...in 遍历访问（需 Reflect.ownKeys），但这只是防御性编程，不是真正的私有（ES2020 引入了 # 前缀的真私有字段）。
26. 正则表达式零宽断言
问题：提取数字 100px 中的 100（不包含 px）。
解析：
零宽断言匹配位置，不匹配字符。

(?=exp)：正向先行断言。
(?!exp)：负向先行断言。
(?<=exp)：正向后行断言。
(?<!exp)：负向后行断言。
let str = "100px 200em";
// 匹配前面是数字，后面不是单词边界的位置... 或者简单点
let reg = /\d+(?=px)/g; 
console.log(str.match(reg)); // ["100"]
javascript

复制代码
第四部分：浏览器与网络 (27-34)
27. 浏览器缓存策略
问题：强缓存与协商缓存的区别及 Header 设置。
解析：

强缓存：不请求服务器。
Expires (HTTP/1.0, 时间戳)。
Cache-Control (HTTP/1.1, max-age=秒)。
协商缓存：向服务器确认是否过期。
Last-Modified / If-Modified-Since (基于时间，精确度秒)。
ETag / If-None-Match (基于文件哈希，精确度高)。
流程：
浏览器请求资源 -> 检查 Cache-Control -> 未过期直接用。
过期 -> 带 ETag 请求服务器 -> 304 (Not Modified) -> 用本地缓存；200 -> 返回新资源。
28. 浏览器输入 URL 到页面渲染的全过程
问题：DNS 解析、TCP 三次握手、DOM 树构建、重排重绘的细节。
解析：

DNS 解析：查找域名的 IP 地址（浏览器缓存 -> hosts -> 本地 DNS -> 根/顶级/权威 DNS）。
TCP 连接：三次握手建立连接（HTTP/3 使用 QUIC/UDP）。
发送请求。
接收响应：HTML 数据。
解析 HTML：
构建DOM树。
解析 CSS 构建 CSSOM 树。
合并生成 Render Tree（渲染树）。
布局：计算位置和大小。
绘制：填充像素。
合成：将图层合成显示。 关键点：<script> 会阻塞 DOM 解析（除非 defer 或 async）。CSS 加载会阻塞 JS 执行。
29. 跨域解决方案
问题：JSONP 和 CORS 的原理。为什么 WebSocket 没有跨域问题？
解析：

CORS (Cross-Origin Resource Sharing)：标准方案。服务器设置 Access-Control-Allow-Origin。分简单请求和预检请求（OPTIONS）。
JSONP：利用 <script> 标签不受同源策略限制。只能发 GET 请求，前后端配合。
PostMessage：用于 iframe 之间通信。
WebSocket：协议 ws:// 不受同源策略限制。
Proxy (开发环境)：webpack-dev-server 利用 Node 代理转发请求。
30. XSS 与 CSRF 攻击及防御
问题：两者的核心区别？Cookie 的 SameSite 属性如何防范 CSRF？
解析：

XSS (Cross-Site Scripting)：攻击者注入恶意脚本。
防御：输入过滤、输出转义（< -> &lt;）、CSP (Content Security Policy)。
CSRF (Cross-Site Request Forgery)：用户不知情下，借用户身份发请求。
防御：
SameSite=Strict/Lax：禁止第三方 Cookie 发送。
CSRF Token：请求头中带随机 Token，攻击者无法伪造。
验证 Referer：检查来源。
31. 虚拟列表
问题：如何渲染 10 万条数据而不卡顿？
解析：
只渲染可视区域内的 DOM 元素。监听 scroll 事件，动态计算 startIndex 和 endIndex。

核心：transform: translateY 撑起滚动条高度或移动列表位置。
优化：使用 requestAnimationFrame 优化滚动计算，防抖。
32. requestIdleCallback 与 requestAnimationFrame
问题：requestAnimationFrame (rAF) 和 setTimeout(fn, 0) 的区别？
解析：

setTimeout：宏任务，受最小时间间隔限制（4ms），刷新率不稳定。
rAF：由浏览器专门控制，通常与屏幕刷新率同步（16.6ms/次），用于动画，保证流畅且当页面后台运行时自动暂停节省资源。
requestIdleCallback：在浏览器空闲时间执行低优先级任务，适合数据埋点、日志上报等。
33. HTTP/2 与 HTTP/3 (QUIC)
问题：HTTP/1.1 的队头阻塞问题是如何解决的？
解析：

HTTP/1.1：长连接，但请求串行发送（必须等上一个响应才能发下一个）。
HTTP/2：多路复用。一个 TCP 连接可以并发发送多个请求流。解决了应用层队头阻塞，但 TCP 层的丢包仍会导致整个连接阻塞。
HTTP/3：基于 QUIC (UDP)。彻底解决了 TCP 层队头阻塞。建立连接快（0-RTT）。
34. 安全性：Content Security Policy (CSP)
问题：如何配置 CSP 防止资源加载异常？
解析：
通过 HTTP Header Content-Security-Policy 或 <meta> 标签。
常用指令：

default-src 'self'：默认只允许加载同源资源。
script-src 'unsafe-inline'：允许内联脚本（一般禁用）。
img-src https:：允许加载 https 图片。
report-uri /report：上报违规日志。
第五部分：工程化、性能与架构 (35-42)
35. Webpack 打包原理
问题：Loader 与 Plugin 的区别？如何实现一个 Plugin？
解析：

Loader：转换器，将文件转换为 AST、字符串等。只处理单个文件。
Plugin：基于事件流机制。监听 Webpack 构建过程中的钩子，执行特定逻辑。
手写 Plugin：
class MyPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
            console.log('资源即将输出');
            callback();
        });
    }
}
javascript

复制代码
36. Tree Shaking (摇树优化)
问题：为什么 ES Module 比 CommonJS 更容易 Tree Shaking？
解析：
Tree Shaking 基于 ESM 的静态分析。在编译时就能确定模块导入了什么、导出了什么。CommonJS 是动态加载，只有运行时才知道导出内容，无法进行静态消除死代码。
副作用：package.json 中配置 "sideEffects": false。

37. Vite 为什么比 Webpack 快？
问题：开发环境下的差异。
解析：

Webpack：打包所有模块，编译后启动服务器。项目越大，启动越慢。
Vite：
基于 ESM。利用浏览器原生 ES 模块能力，不打包，按需编译。
使用 esbuild (Go 语言编写) 预编译依赖，比 Webpack (Node) 快 10-100 倍。
启动瞬间即完成，冷启动极快。
38. 性能优化指标 (Core Web Vitals)
问题：LCP、FID、CLS 分别代表什么？
解析：

LCP (Largest Contentful Paint)：最大内容绘制。衡量视觉加载速度。
FID (First Input Delay)：首次输入延迟。衡量交互响应时间。
CLS (Cumulative Layout Shift)：累积布局偏移。衡量视觉稳定性（防止页面抖动）。
39. 前端错误监控
问题：如何捕获运行时错误和网络错误？
解析：

JS 错误：window.onerror (全局)、window.addEventListener('unhandledrejection') (Promise 未捕获)。
React 错误：ErrorBoundary 组件。
Vue 错误：Vue.config.errorHandler。
资源错误：window.addEventListener('error', ..., true) (捕获阶段)。
Sentry：常用的错误监控平台方案（集成 Source Map 还原源码）。
40. 前端设计模式应用
问题：单例模式、策略模式在前端的具体应用。
解析：

单例模式：全局状态管理、弹窗组件、WebSocket 实例。
策略模式：表单验证（不同的规则策略）、动画算法（缓动函数）。
代理模式：图片懒加载（Proxy Image -> Real Image）。
装饰器模式：React 中的 HOC (Higher Order Component)。
41. TypeScript 高级类型
问题：什么是泛型？Pick 和 Omit 怎么实现？
解析：

泛型：function identity(arg: T): T { return arg; }，保证类型灵活且安全。
实现：
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
javascript

复制代码
42. 微前端架构
问题：qiankun 的核心原理是什么？
解析：
qiankun 基于 single-spa。

样式隔离：Shadow DOM 或严格 CSS 作用域（如添加前缀）。
JS 沙箱：
快照沙箱：记录 window 差异，卸载时恢复（不支持多实例）。
Proxy 沙箱：利用 ES6 Proxy 拦截 window 操作，激活时赋值，失活时回滚，支持多实例。
通信：基于自定义事件或全局状态。
第六部分：框架相关（React/Vue 深度） (43-50)
43. Fiber 架构解决了什么问题？
问题：React 为什么要引入双缓存树？
解析：
React 15/16 之前是递归渲染，一旦开始无法中断，长时间占用主线程导致卡顿。
Fiber 将组件渲染转化为链表结构，支持任务拆分和中断恢复。

双缓存：Current Tree（当前屏幕显示）和 WorkInProgress Tree（正在内存中构建的树）。构建完成后直接交换指针，渲染过程用户无感知。
44. React Diff 算法（O(n) 复杂度）
问题：Key 的作用是什么？为什么不要用 Index 做 Key？
解析：

规则：
层级比较：只比较同层级节点。
组件类型：类型变了，直接销毁重建。
Key：列表比较的唯一标识。
Index 问题：如果在中间插入数据，会导致后面的所有节点 Key 变化，全部被认为修改，导致无谓的 DOM 重排。建议使用唯一 ID。
45. Vue2 与 Vue3 响应式原理深度对比
问题：Vue 2 的 set 和 delete 为什么存在？Vue3 怎么解决？
解析：

Vue2：Object.defineProperty 无法拦截数组下标变化（重写7个数组方法），无法拦截对象属性的新增和删除。所以提供 vm.$set 和 vm.$delete 强制触发 watcher。
Vue3：Proxy 天然支持所有操作的拦截，不需要这些 API。
46. NextTick 原理
问题：Vue 为什么要异步更新 DOM？如何选择微任务还是宏任务？
解析：
为了性能，防止数据变动频繁触发多次 DOM 更新。

原理：利用 Promise.then (微任务) 优先，不支持则降级为 MutationObserver 或 setImmediate / setTimeout。
场景：this.a = 1; this.b = 2; 多次赋值会被合并到一次 watcher 更新中。
47. React Hooks 为什么不能写在条件语句里？
问题：Hooks 的依赖机制。
解析：
Hooks 的实现依赖于调用顺序。React 维护了一个链表来存储 Hooks 状态。如果写在 if 中，每次渲染顺序不一致，导致链表取值错乱（比如拿到的 state 是上一个 hook 的），引发 Bug。
关键：useState 本质是一个闭包。

48. Redux 中间件模型（洋葱模型）
问题：applyMiddleware 的实现原理。
解析：
利用函数式组合 (dispatch) => (next) => (action) => { ... }。

const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
};
// 类似 Koa 的洋葱模型，层层包裹。
javascript

复制代码
49. React 合成事件
问题：为什么 React 要自己搞一套事件系统？
解析：

兼容性：抹平不同浏览器差异。
批量更新：利用事件委托，将事件冒泡到 Root 节点处理，结合 React 的批处理机制。
优先级：支持事件优先级（点击高于拖拽）。
50. SSR (服务端渲染) 与 CSR (客户端渲染) 的选择
问题：Next.js (React) 和 Nuxt.js (Vue) 的优势。
解析：

CSR：首屏慢（白屏），不利于 SEO。
SSR：服务端生成 HTML 字符串，浏览器直接展示。
优势：首屏快，利于 SEO（爬虫直接爬到内容）。
劣势：服务端压力大，开发受限（window/document 不存在）。
SSG (静态生成)：Next.js 提倡的方式，构建时生成 HTML，结合 CDN 性能最佳。