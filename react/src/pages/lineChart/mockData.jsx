	// utils/mockData.ts
	/**
	 * 生成指定数量的模拟数据
	 * @param count 数据条数，默认 100000
	 */
	export const generateMockData = (count) => {
        const data = [];
        let baseValue = Math.random() * 1000;
        const time = Date.now();
        for (let i = 0; i < count; i++) {
          // 模拟时间推移
          const now = new Date(time + i * 60 * 1000);
          // 模拟数据波动
          baseValue += Math.random() * 20 - 10;
          data.push([now.getTime(), Math.round(baseValue)]);
        }
        return data;
      };