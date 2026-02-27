// // import React, { useState, useMemo } from 'react';
// // import { useWebWorker } from '../../hooks/useWebworker'; // 引入公共 Hook
// // const DataProcessor = () => {
// //   const [keyword, setKeyword] = useState('');
// //   // 模拟 10万条数据
// //   const bigData = useMemo(() => {
// //     return Array.from({ length: 100000 }, (_, i) => ({
// //       id: i,
// //       name: `用户-${Math.random().toString(36).substring(2, 8)}`,
// //     }));
// //   }, []);
// //   // ==================================================
// //   // 核心使用区域
// //   // ==================================================
// //   // 定义 Worker 内部的纯函数逻辑
// //   // 注意：这里不能引用组件作用域的变量（如 keyword），所有需要的数据必须通过 run 传递
// //   const heavyCalculation = (data) => {
// //     const { list, query } = data;
// //     // 模拟耗时过滤
// //     return list.filter(item => item.name.includes(query));
// //   };
// //   // 使用 Hook
// //   const { result, run, status } = useWebWorker(heavyCalculation);
// //   // 处理输入事件
// //   const handleChange = (e) => {
// //     const val = e.target.value;
// //     setKeyword(val);
// //     if (!val) return;
// //     // 触发 Worker 计算
// //     // 将数据和方法参数一起传入
// //     run({ list: bigData, query: val });
// //   };
// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h3>封装后的 Web Worker 示例</h3>
// //       <input 
// //         type="text" 
// //         placeholder="输入关键字筛选..." 
// //         onChange={handleChange} 
// //         style={{ padding: 8, width: 300 }}
// //       />
// //       <div style={{ marginTop: 10, color: status === 'running' ? 'blue' : 'green' }}>
// //         状态: {status}
// //       </div>
// //       <ul style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', marginTop: 10 }}>
// //         {/* result 即为 Worker 返回的结果 */}
// //         {result && result.slice(0, 20).map(item => (
// //           <li key={item.id}>{item.name}</li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };
// // export default DataProcessor;

// // import React, { useState } from 'react';
// // import { useWebWorker } from '../../hooks/useWebworker';

// // const ApiDemo = () => {
// //   const [keyword, setKeyword] = useState('');

// //   // ==================================================
// //   // 1. 定义 Worker 函数：包含真实 fetch 请求
// //   // ==================================================
// //   const fetchAndProcessData = async (query) => {
// //     // 注意：Worker 内部可以使用 fetch，但不能使用 XMLHttpRequest
// //     // const url = 'http://jsonplaceholder.typicode.com/api/users';
    
// //     // console.log('Worker: 开始请求接口...', url);
// //     const response = await fetch('/api/users');
// //     console.log(response,'===')
// //     const data = await response.json();

// //     // 模拟后端返回数据后的前端二次加工（如过滤、排序）
// //     // 这一步如果是大计算量，放在 Worker 里非常有意义
// //     const filtered = data.filter(user => 
// //       user.name.toLowerCase().includes(query.toLowerCase())
// //     );

// //     return filtered; // 返回处理好的数据
// //   };

// //   // 2. 使用 Hook
// //   const { result, run, status } = useWebWorker(fetchAndProcessData);

// //   // 3. 触发搜索
// //   const handleSearch = (e) => {
// //     const val = e.target.value;
// //     setKeyword(val);
// //     // 发送关键词给 Worker
// //     run(val);
// //   };

// //   return (
// //     <div style={{ padding: 20, border: '1px solid #ccc', marginTop: 20 }}>
// //       <h3>Web Worker 请求真实 API 示例</h3>
      
// //       <div>
// //         <input 
// //           type="text" 
// //           placeholder="输入名字过滤 (如 Ervin, Kurt)" 
// //           onChange={handleSearch} 
// //           style={{ padding: 8, width: 300 }}
// //         />
// //         <span style={{ marginLeft: 10 }}>
// //           {status === 'running' && '请求中...'}
// //           {status === 'success' && '请求成功'}
// //         </span>
// //       </div>

// //       <div style={{ marginTop: 10 }}>
// //         <h4>结果：</h4>
// //         {result && result.length === 0 && <div>无匹配数据</div>}
// //         <ul>
// //           {result && result.map(user => (
// //             <li key={user.id}>
// //               {user.name} - <small>{user.email}</small>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ApiDemo;



// import React, { useState } from 'react';
// import { useWebWorker } from '../../hooks/useWebworker';
// const SearchDemo = () => {
//   const [keyword, setKeyword] = useState('');
//   // ==================================================
//   // 定义 Worker 逻辑：
//   // 这里模拟了一个耗时请求 + 大数据量过滤
//   // ==================================================
//   const workerTask = async (query) => {
//     // 1. 模拟网络延迟 (如果是真实接口，这里写 fetch)
//     await new Promise((resolve) => setTimeout(resolve, 300));
//     // 2. 模拟生成 100,000 条数据 (这是 Worker 的优势所在，不阻塞 UI)
//     // 实际项目中，这步数据可能来自 fetch 接口
//     const mockData = Array.from({ length: 100 }, (_, i) => ({
//       id: i,
//       name: `测试-${i}`,
//       age: Math.floor(Math.random() * 50) + 18,
//     }));
//     // 3. 核心计算：过滤 10 万条数据
//     // 如果不用 Worker，这里会卡死主线程 input 输入
//     const filtered = mockData.filter((item) => 
//       item.name.includes(query) || item.id.toString().includes(query)
//     );
//     console.log(filtered,'====')
//     // 4. 返回部分数据 (避免传输过多数据导致渲染卡顿)
//     return {
//       total: filtered.length,
//       list: filtered.slice(0, 10), // 只展示前 50 条
//     };
//   };
//   // 使用 Hook
//   const { result, run, status } = useWebWorker(workerTask);
//   // 处理输入
//   const handleChange = (e) => {
//     const val = e.target.value;
//     setKeyword(val);
//     // 输入防抖优化
//     if (val.trim()) {
//       run(val);
//     }
//   };
//   return (
//     <div style={{ padding: '20px', fontFamily: 'monospace' }}>
//       <h3>Web Worker 高性能搜索演示</h3>
//       <p>模拟数据量: <b>100,000</b> 条 | 输入内容将触发 Worker 计算</p>
//       <div style={{ marginBottom: '20px' }}>
//         <input
//           type="text"
//           placeholder="输入任意字符过滤..."
//           value={keyword}
//           onChange={handleChange}
//           style={{ padding: '10px', width: '300px', fontSize: '16px' }}
//         />
//         <span style={{ marginLeft: '10px', color: status === 'running' ? 'orange' : 'green' }}>
//           {status === 'running' && '⚙️ 计算中...'}
//           {status === 'success' && '✅ 计算完成'}
//         </span>
//       </div>
//       {/* 结果展示区 */}
//       <div style={{ 
//         border: '1px solid #ddd', 
//         padding: '10px', 
//         height: '300px', 
//         overflowY: 'auto',
//         backgroundColor: '#f9f9f9' 
//       }}>
//         {status === 'idle' && <div style={{color: '#999'}}>等待输入...</div>}
//         {result && (
//           <>
//             <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
//               匹配结果共 {result.total} 条，展示前 50 条：
//             </div>
//             <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
//               {result.list.map((item) => (
//                 <li key={item.id} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
//                   ID: {item.id} | Name: {item.name}
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
// export default SearchDemo;


// import React, { useState, useEffect, useRef } from 'react';

// const FibDemo = () => {
//   const [count, setCount] = useState(0); // 用来验证页面是否卡死
//   const [result, setResult] = useState('等待计算...');
//   const [isWorking, setIsWorking] = useState(false);

//   // 1. 定义 Worker 代码 (斐波那契递归计算)
//   // 注意：这是个极其消耗 CPU 的算法
//   const workerCode = `
//     self.onmessage = function(e) {
//       const n = e.data;
      
//       // 递归计算斐波那契
//       const fib = (x) => {
//         if (x <= 1) return x;
//         return fib(x - 1) + fib(x - 2);
//       };

//       const res = fib(n);
//       self.postMessage(res);
//     }
//   `;

//   const workerRef = useRef(null);

//   // 2. 初始化 Worker
//   useEffect(() => {
//     const blob = new Blob([workerCode], { type: 'application/javascript' });
//     const url = URL.createObjectURL(blob);
//     workerRef.current = new Worker(url);

//     // 监听 Worker 返回的结果
//     workerRef.current.onmessage = (e) => {
//       setResult(e.data);
//       setIsWorking(false);
//     };

//     // 清理
//     return () => {
//       workerRef.current.terminate();
//       URL.revokeObjectURL(url);
//     };
//   }, []);

//   // 3. 这是一个自动递增的计数器
//   // 如果你点击"主线程计算"，这个数字会停止跳动（页面卡死）
//   // 如果你点击"Worker计算"，这个数字会继续跳动（页面流畅）
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCount((c) => c + 1);
//     }, 100);
//     return () => clearInterval(timer);
//   }, []);

//   // 4. 错误演示：在主线程计算（会卡死页面）
//   const handleMainThread = () => {
//     setIsWorking(true);
//     setResult('主线程计算中...');
    
//     // 模拟阻塞
//     setTimeout(() => {
//       const fib = (x) => (x <= 1 ? x : fib(x - 1) + fib(x - 2));
//       // 这里的同步递归会阻塞浏览器渲染
//       const res = fib(45);
//       setResult(res);
//       setIsWorking(false);
//     }, 0);
//   };

//   // 5. 正确演示：在 Worker 计算（不卡顿）
//   const handleWorkerThread = () => {
//     setIsWorking(true);
//     setResult('Worker 计算中...');
//     workerRef.current.postMessage(45); // 发送任务
//   };

//   return (
//     <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
//       <h3>Web Worker 性能对比演示</h3>
      
//       {/* 状态指示器 */}
//       <div style={{ 
//         padding: 10, 
//         background: '#f0f0f0', 
//         marginBottom: 20,
//         borderRadius: 4 
//       }}>
//         页面流畅度计数器: <b style={{ fontSize: 20, color: 'green' }}>{count}</b>
//         <br />
//         <small>(如果数字停止跳动，说明页面卡死了)</small>
//       </div>

//       <div style={{ display: 'flex', gap: 10 }}>
//         <button 
//           onClick={handleMainThread} 
//           disabled={isWorking}
//           style={{ padding: '10px 20px', background: '#ff4d4f', color: '#fff', border: 'none', cursor: 'pointer' }}
//         >
//           主线程计算 (会卡死)
//         </button>

//         <button 
//           onClick={handleWorkerThread} 
//           disabled={isWorking}
//           style={{ padding: '10px 20px', background: '#52c41a', color: '#fff', border: 'none', cursor: 'pointer' }}
//         >
//           Worker 计算 (不卡顿)
//         </button>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         计算结果 (fib 45): <b>{result}</b>
//       </div>
//     </div>
//   );
// };

// export default FibDemo;







import React, { useState, useEffect, useRef } from 'react';
const WorkerDemo = () => {
  const [progress, setProgress] = useState(0);       // 计算进度
  const [result, setResult] = useState(null);       // 最终结果
  const [isRunning, setIsRunning] = useState(false);// 运行状态
  const workerRef = useRef(null);                   // 存储 Worker 实例
  // 1. 定义 Worker 代码 (字符串形式)
  // 考点：通过 Blob URL 创建内联 Worker，无需额外文件
  const workerScript = `
    self.onmessage = function(e) {
      const total = e.data;
      let count = 0;
      // 模拟 100亿次计算的分批次处理
      // 为了演示进度，我们每 1亿次汇报一次
      const chunk = 100000000; 
      for (let i = 0; i < total; i++) {
        count++;
        // 关键点：定期向主线程发送进度消息
        if (i % chunk === 0) {
          self.postMessage({ type: 'progress', value: (i / total) * 100 });
        }
      }
      // 发送最终结果
      self.postMessage({ type: 'done', value: count });
    };
  `;
  useEffect(() => {
    // 2. 初始化 Worker
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);
    // 3. 监听 Worker 消息
    workerRef.current.onmessage = (e) => {
      const { type, value } = e.data;
      if (type === 'progress') {
        // 更新进度条
        setProgress(value.toFixed(2));
      } else if (type === 'done') {
        // 计算完成
        setResult(value);
        setIsRunning(false);
        setProgress(100);
      }
    };
    // 4. 组件卸载时销毁 Worker (防止内存泄漏)
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(url);
    };
  }, []);
  const startCalc = () => {
    setIsRunning(true);
    setResult(null);
    setProgress(0);
    // 发送 100亿次 (100亿) 的计算任务
    workerRef.current.postMessage(10000000000);
  };
  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h3>Web Worker 高频面试题：大数累加</h3>
      <button onClick={startCalc} disabled={isRunning}>
        {isRunning ? '计算中...' : '开始 100亿次计算'}
      </button>
      <div style={{ marginTop: 20, width: '100%', background: '#eee', height: 20 }}>
        {/* 进度条 */}
        <div 
          style={{ 
            width: `${progress}%`, 
            background: 'green', 
            height: '100%', 
            transition: 'width 0.1s' 
          }} 
        />
      </div>
      <div style={{ marginTop: 10 }}>
        进度: {progress}%
      </div>
      {result && (
        <div style={{ marginTop: 10, color: 'green', fontWeight: 'bold' }}>
          计算完成！结果: {result.toLocaleString()}
        </div>
      )}
    </div>
  );
};
export default WorkerDemo;