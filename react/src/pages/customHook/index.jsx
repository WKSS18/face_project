import { useState, useEffect } from 'react';
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次变化都设置一个新的定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // 清理上一次的定时器（如果 value 在 delay 时间内变化）
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // 依赖 value
  return debouncedValue;
}
// 使用
function SearchInput() {
  const [text, setText] = useState("Hello");
  const debouncedText = useDebounce(text, 500);
  useEffect(() => {
    // 只会在用户停止输入 500ms 后执行一次 API 请求
    console.log("Searching for:", debouncedText);
  }, [debouncedText]);
  return <input onChange={(e) => setText(e.target.value)} />;
}
export default SearchInput