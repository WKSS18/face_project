
'use client';

import { useState, useEffect } from 'react';

export default function ClientComponent() {
    const [count, setCount] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // 客户端组件可以使用useEffect
    useEffect(() => {
        setIsClient(true);
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleIncrement = () => {
        setCount(count + 1);
    };

    const handleDecrement = () => {
        setCount(count - 1);
    };

    const handleReset = () => {
        setCount(0);
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">客户端交互组件</h3>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg">计数器:</span>
                    <span className="text-3xl font-bold">{count}</span>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleDecrement}
                        className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        减少
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        重置
                    </button>
                    <button
                        onClick={handleIncrement}
                        className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                        增加
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">客户端状态</h4>
                    <p className="text-sm text-gray-600">
                        {isClient ? '✓ 客户端已激活' : '⏳ 正在激活客户端...'}
                    </p>
                </div>

                <div className="bg-pink-50 rounded-lg p-4">
                    <h4 className="font-semibold text-pink-800 mb-2">实时时间</h4>
                    <p className="text-sm text-gray-600">
                        {currentTime.toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">交互说明</h4>
                <p className="text-sm text-gray-600">
                    这个组件使用了useState和useEffect Hooks来管理状态和副作用，
                    实现了计数器功能和实时时间显示。
                </p>
            </div>
        </div>
    );
}
