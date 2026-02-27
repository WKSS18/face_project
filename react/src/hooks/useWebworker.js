// import { useState, useEffect, useRef, useCallback } from 'react';
// /**
//  * 公共 Hook：封装 Web Worker 的创建、通信与销毁
//  * @param {Function} workerFunc - Worker 内部要执行的函数 (注意：不能闭包引用外部变量)
//  * @returns {{ result: any, run: Function, status: string, error: Error }}
//  */
// export const useWebWorker = (workerFunc) => {
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState('idle'); // idle | running | success | error
//   const [error, setError] = useState(null);
//   const workerRef = useRef(null);
//   // 1. 初始化 Worker
//   useEffect(() => {
//     // 将函数体转为字符串，构建 Blob URL
//     const workerCode = `
//       self.onmessage = function(e) {
//         try {
//           // 执行传入的函数逻辑
//           const result = (${workerFunc})(e.data);
//           self.postMessage(result);
//         } catch (err) {
//           self.postMessage({ error: err.message });
//         }
//       }
//     `;
//     const blob = new Blob([workerCode], { type: 'application/javascript' });
//     const url = URL.createObjectURL(blob);
//     workerRef.current = new Worker(url);
//     // 监听消息
//     workerRef.current.onmessage = (e) => {
//       if (e.data && e.data.error) {
//         setError(new Error(e.data.error));
//         setStatus('error');
//       } else {
//         setResult(e.data);
//         setStatus('success');
//       }
//     };
//     // 监听错误
//     workerRef.current.onerror = (e) => {
//       setError(new Error(e.message));
//       setStatus('error');
//     };
//     // 清理函数：组件卸载时销毁 Worker
//     return () => {
//       if (workerRef.current) {
//         workerRef.current.terminate();
//       }
//       URL.revokeObjectURL(url);
//     };
//   }, [workerFunc]);
//   // 2. 暴露 run 方法，用于触发计算
//   const run = useCallback((payload) => {
//     if (workerRef.current) {
//       // 重置状态
//       setStatus('running');
//       setResult(null);
//       setError(null);
//       // 发送数据
//       workerRef.current.postMessage(payload);
//     }
//   }, []);
//   return { result, run, status, error };
// };

// import { useState, useEffect, useRef, useCallback } from 'react';

// export const useWebWorker = (workerFunc) => {
//   const [result, setResult] = useState(null);
//   const [status, setStatus] = useState('idle');
  
//   const workerRef = useRef(null);

//   useEffect(() => {
//     // 核心修改：包装成 async 立即执行函数，支持 await
//     const workerCode = `
//       self.onmessage = async function(e) {
//         try {
//           // 这里 await 等待异步函数（如 fetch）完成
//           const result = await (${workerFunc})(e.data);
//           self.postMessage(result);
//         } catch (err) {
//           self.postMessage({ error: err.message });
//         }
//       }
//     `;

//     const blob = new Blob([workerCode], { type: 'application/javascript' });
//     const url = URL.createObjectURL(blob);
//     workerRef.current = new Worker(url);

//     workerRef.current.onmessage = (e) => {
//       if (e.data && e.data.error) {
//         console.error('Worker Error:', e.data.error);
//         setStatus('error');
//       } else {
//         setResult(e.data);
//         setStatus('success');
//       }
//     };

//     return () => {
//       workerRef.current && workerRef.current.terminate();
//       URL.revokeObjectURL(url);
//     };
//   }, [workerFunc]);

//   const run = useCallback((payload) => {
//     if (workerRef.current) {
//       setStatus('running');
//       workerRef.current.postMessage(payload);
//     }
//   }, []);

//   return { result, run, status };
// };



import { useState, useEffect, useRef, useCallback } from 'react';
/**
 * 通用的 Web Worker Hook
 * @param {Function} workerFunc - Worker 内部执行的函数 (支持 async)
 * @returns {{ result: any, run: Function, status: string }}
 */
export const useWebWorker = (workerFunc) => {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | running | success | error
  const workerRef = useRef(null);
  useEffect(() => {
    // 将函数体转为字符串，并包装成自执行函数
    // 注意：添加 async 支持，方便在 Worker 内部进行 fetch 或大量计算
    const workerCode = `
      self.onmessage = async function(e) {
        try {
          const result = await (${workerFunc})(e.data);
          self.postMessage(result);
        } catch (err) {
          self.postMessage({ __error: true, message: err.message });
        }
      }
    `;
    // 创建 Blob URL
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    workerRef.current = new Worker(url);
    // 监听消息
    workerRef.current.onmessage = (e) => {
      if (e.data && e.data.__error) {
        console.error('Worker Error:', e.data.message);
        setStatus('error');
      } else {
        setResult(e.data);
        setStatus('success');
      }
    };
    // 监听错误
    workerRef.current.onerror = (e) => {
      console.error('Worker Runtime Error:', e);
      setStatus('error');
    };
    // 清理函数：组件卸载时销毁 Worker 和 URL
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      URL.revokeObjectURL(url);
    };
  }, [workerFunc]);
  // 暴露 run 方法
  const run = useCallback((payload) => {
    if (workerRef.current) {
      setStatus('running');
      setResult(null);
      workerRef.current.postMessage(payload);
    }
  }, []);
  return { result, run, status };
};