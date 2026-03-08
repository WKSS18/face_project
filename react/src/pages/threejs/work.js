	// texture-loader.worker.js
	self.onmessage = async function(e) {
	    const { url } = e.data;
	    try {
	        console.log(`[Worker] 开始下载: ${url}`);
	        // 1. Fetch 获取图片数据 (Blob)
	        const response = await fetch(url);
	        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
	        const blob = await response.blob();
	        console.log(`[Worker] 下载完成，开始解码...`);
	        // 2. 在 Worker 中解码图片 (这是最耗时的 CPU 操作)
	        // createImageBitmap 是异步的，且不会阻塞主线程 UI
	        const imageBitmap = await createImageBitmap(blob);
	        console.log(`[Worker] 解码完成，准备传输回主线程: ${imageBitmap.width}x${imageBitmap.height}`);
	        // 3. 将 ImageBitmap 转移回主线程
	        // 第二个参数 [imageBitmap] 表示使用 Transferable Object，转移所有权而非拷贝，速度极快
	        self.postMessage({
	            imageBitmap: imageBitmap,
	            width: imageBitmap.width,
	            height: imageBitmap.height
	        }, [imageBitmap]);
	    } catch (error) {
	        console.error('[Worker] 加载失败:', error);
	        self.postMessage({ error: error.message });
	    }
	};