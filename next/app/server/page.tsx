
import ServerComponent from '../../components/server';
export default function ServerPage() {

    if (typeof window === 'undefined') {
        // 代码在服务器端执行
        console.log('当前在服务端');
    } else {
        // 代码在客户端执行
        console.log('当前在客户端');
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Next.js 服务端组件示例</h1>
                    <p className="text-lg text-gray-600">这个页面使用服务端组件渲染数据</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">服务端获取的数据</h2>
                    <ServerComponent />
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">服务端组件特点</h2>
                    <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                            <span>在服务器上执行，不发送JavaScript到客户端</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                            <span>可以直接访问数据库和后端服务</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                            <span>更好的SEO和初始加载性能</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-6 w-6 text-green-500 mr-2">✓</div>
                            <span>自动代码分割</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
