
import React, { useState, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const App = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '你好！我是AI助手，有什么可以帮助你的吗？', sender: 'ai' },
    { id: 2, text: '你能解释一下虚拟滚动的原理吗？', sender: 'user' },
    { id: 3, text: '虚拟滚动是一种只渲染可见区域内容的技术。它通过计算容器高度和项目大小，只渲染当前视口内的元素，从而大幅提升长列表的性能。', sender: 'ai' }
  ]);
  
  const parentRef = useRef(null);
  
  // 添加新消息
  const addMessage = (text, sender) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender
    };
    setMessages(prev => [...prev, newMessage]);
  };
  
  // 模拟AI回复
  const handleSend = (inputText) => {
    if (!inputText.trim()) return;
    
    addMessage(inputText, 'user');
    
    // 模拟AI回复延迟
    setTimeout(() => {
      addMessage(`这是对"${inputText}"的AI回复。虚拟滚动技术可以显著提升长列表性能，特别是在处理大量聊天记录时。`, 'ai');
    }, 1000);
  };
  
  // 虚拟滚动配置
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });
  
  // 滚动到底部
  const scrollToBottom = () => {
    rowVirtualizer.scrollToIndex(messages.length - 1);
  };
  
  // 自动滚动到底部
  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">AI对话虚拟滚动优化示例</h1>
      </header>
      
      <div className="flex-1 overflow-hidden p-4">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          {/* 聊天区域 */}
          <div 
            ref={parentRef}
            className="flex-1 overflow-auto p-4"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const message = messages[virtualItem.index];
                return (
                  <div
                    key={message.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-4 ${
                          message.sender === 'user' 
                            ? 'bg-indigo-500 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <div className="font-semibold text-sm mb-1">
                          {message.sender === 'user' ? '你' : 'AI助手'}
                        </div>
                        <div className="text-sm">{message.text}</div>
                      </div>
                    </div>
                  </div>
                  
                );
              })}
            </div>
          </div>
          
          {/* 输入区域 */}
          <MessageInput onSend={handleSend} />
        </div>
      </div>
      
      <div className="p-4 bg-gray-100 text-center text-sm text-gray-500">
        使用 @tanstack/react-virtual 优化的AI对话列表，支持高性能长列表渲染
      </div>
    </div>
  );
};

// 消息输入组件
const MessageInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入消息..."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-6 py-2 rounded-r-lg hover:bg-indigo-600 transition-colors"
        >
          发送
        </button>
      </div>
    </form>
  );
};

export default App;
