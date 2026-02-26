	// views/Dashboard.tsx
	import React, { useEffect, useState } from 'react';
	import LargeLineChart from './lineCom';
	import { generateMockData } from './mockData';
	const Dashboard = () => {
	  const [chartData, setChartData] = useState([]);
	  const [loading, setLoading] = useState(true);
	  useEffect(() => {
	    // 模拟异步请求耗时
	    setLoading(true);
	    setTimeout(() => {
	      const data = generateMockData(100000);
	      setChartData(data);
	      setLoading(false);
	    }, 500);
	  }, []);
	  return (
	    <div style={{ padding: '20px' }}>
	      <h1>React ECharts 10万数据优化演示</h1>
	      {loading ? (
	        <div style={{ textAlign: 'center', marginTop: '100px' }}>
	          正在生成 100,000 条数据...
	        </div>
	      ) : (
	        <LargeLineChart 
	            data={chartData} 
	            title="实时监控数据流 (React版)" 
	        />
	      )}
	    </div>
	  );
	};
	export default Dashboard;