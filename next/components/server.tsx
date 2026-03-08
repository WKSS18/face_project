
// 服务端组件 - 不能使用useState, useEffect等客户端Hooks
export default async function ServerComponent() {
    // 模拟服务端数据获取
    const fetchData = async () => {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            id: 1,
            title: "从服务端获取的数据",
            content: "这是通过服务端组件直接从数据库或API获取的内容，不需要客户端JavaScript。",
            timestamp: new Date().toLocaleString(),
            stats: {
                views: 1245,
                likes: 89,
                comments: 23
            }
        };
    };

    const data = await fetchData();

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{data.title}</h3>
                <p className="mb-4">{data.content}</p>
                <div className="text-sm opacity-90">更新时间: {data.timestamp}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{data.stats.views}</div>
                    <div className="text-sm text-gray-600">浏览量</div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{data.stats.likes}</div>
                    <div className="text-sm text-gray-600">点赞数</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{data.stats.comments}</div>
                    <div className="text-sm text-gray-600">评论数</div>
                </div>
            </div>
        </div>
    );
}
