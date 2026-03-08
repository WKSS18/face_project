'use client';

import ClientComponent from '../../components/client';

export default function ClientPage() {

    if (typeof window === 'undefined') {
        // 代码在服务器端执行
        console.log('当前在服务端');
    } else {
        // 代码在客户端执行
        console.log('当前在客户端1111');
    }

    function test(args: any) {
        console.log(arguments[0], arguments[1], args)
    }
    console.log(test(2), '======')
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Next.js 客户端组件示例</h1>
                    <p className="text-lg text-gray-600">这个页面使用客户端组件实现交互功能</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">交互式客户端组件</h2>
                    <ClientComponent />
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">客户端组件特点</h2>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-purple-500 mr-2">✓</div>
                            <span>在浏览器中执行，支持交互和状态管理</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-purple-500 mr-2">✓</div>
                            <span>可以使用useState, useEffect等React Hooks</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-purple-500 mr-2">✓</div>
                            <span>支持事件处理和用户交互</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-purple-500 mr-2">✓</div>
                            <span>可以使用浏览器API</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
