import React, { useEffect, useRef } from 'react';
// 修正点：使用具名导入 { Chart }，而不是 import Chart
import { Chart } from '@antv/g2'; 
const MyChart = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ];
    // 初始化图表实例
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
      height: 300,
    });
    chart.data(data);
    // G2 5.x 写法
    chart.interval().encode('x', 'genre').encode('y', 'sold');
    chart.render();
    return () => chart.destroy();
  }, []);
  return (
    <div ref={containerRef} style={{ width: '100%', height: '300px' }}></div>
  );
};
export default MyChart;