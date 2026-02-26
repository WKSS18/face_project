import React, { useState, useEffect, useRef, useCallback } from 'react';
// 1. 按需引入：引入核心模块和具体组件
import * as echarts from 'echarts/core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer
]);
// 样式文件（模拟 CSS Modules 或 styled-components）
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  chartSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px'
  },
  chartWrapper: {
    width: '100%',
    height: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  skeleton: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px'
  }
};
// ---------------------------------------------------
// 1. 骨架屏组件
// ---------------------------------------------------
const ChartSkeleton = () => (
  <div style={styles.skeleton}>
    <span>图表加载中...</span>
  </div>
);
// ---------------------------------------------------
// 2. 懒加载 Hook (IntersectionObserver)
// ---------------------------------------------------
const useLazyLoad = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // 兼容性处理：如果浏览器不支持 IntersectionObserver，直接显示
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      // 当元素进入视口时
      if (entry.isIntersecting) {
        setIsVisible(true);
        // 一旦加载，停止观察，避免重复计算
        observer.unobserve(node);
      }
    }, {
      rootMargin: '100px', // 提前 100px 触发，提升用户体验
      threshold: 0.01,
      ...options
    });
    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [options]);
  return [ref, isVisible];
};
// ---------------------------------------------------
// 3. 通用图表组件
// ---------------------------------------------------
const BaseChart = ({ option, loadingComponent }) => {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const [wrapperRef, isVisible] = useLazyLoad();
  // 初始化和更新图表
  useEffect(() => {
    if (!isVisible || !chartRef.current) return;
    // 初始化 ECharts 实例
    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current);
    }
    // 设置配置项
    instanceRef.current.setOption(option);
    // 响应式调整
    const handleResize = () => instanceRef.current?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // 销毁实例，防止内存泄漏
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, [isVisible, option]);
  return (
    <div ref={wrapperRef} style={styles.chartWrapper}>
      {isVisible ? (
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      ) : (
        loadingComponent || <ChartSkeleton />
      )}
    </div>
  );
};
// ---------------------------------------------------
// 4. 模拟数据与具体业务组件
// ---------------------------------------------------
const mockBarOption = {
  title: { text: '销售数据柱状图', left: 'center' },
  tooltip: {},
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'bar' }]
};
const mockLineOption = {
  title: { text: '访问量折线图', left: 'center' },
  tooltip: {},
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ data: [820, 932, 901, 934, 1290, 1330, 1320], type: 'line', smooth: true }]
};
const mockPieOption = {
  title: { text: '用户来源饼图', left: 'center' },
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', left: 'left' },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};
const App = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>React 图表性能优化方案演示</h1>
      {/* 模拟首屏以下的区域，需要滚动才能看到 */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <h2>请向下滚动查看懒加载效果 👇</h2>
      </div>
      {/* 这部分图表在视口外，初始化时不会渲染，滚入视口时才开始渲染 */}
      <h3>第一组图表 (进入视口才加载)</h3>
      <div style={styles.chartSection}>
        <div style={{ flex: 1 }}>
          <BaseChart option={mockBarOption} />
        </div>
        <div style={{ flex: 1 }}>
          <BaseChart option={mockLineOption} />
        </div>
      </div>
      <h3>第二组图表 (继续滚动加载)</h3>
      <div style={styles.chartSection}>
        <div style={{ flex: 1 }}>
          <BaseChart option={mockPieOption} />
        </div>
        <div style={{ flex: 1 }}>
          <BaseChart option={mockBarOption} />
        </div>
      </div>
    </div>
  );
};
export default App;