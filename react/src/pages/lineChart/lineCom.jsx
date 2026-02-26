	// components/LargeLineChart.tsx
	import React, { useRef, useEffect, useState } from 'react';
	import * as echarts from 'echarts/core';
	import { LineChart } from 'echarts/charts';
	import {
	  TitleComponent,
	  TooltipComponent,
	  GridComponent,
	  DataZoomComponent,
	  LegendComponent
	} from 'echarts/components';
	import { CanvasRenderer } from 'echarts/renderers';
	// 注册必要的模块
	echarts.use([
	  LineChart,
	  TitleComponent,
	  TooltipComponent,
	  GridComponent,
	  DataZoomComponent,
	  LegendComponent,
	  CanvasRenderer
	]);
	// 定义组件 Props 接口
	// interface LargeLineChartProps {
	//   data: [number, number][];
	//   title?: string;
	//   height?: string; // 支持自定义高度
	// }
	const LargeLineChart = ({
	  data,
	  title = '10万数据性能测试',
	  height = '500px'
	}) => {
	  // 1. 用于获取 DOM 节点
	  const chartRef = useRef(null);
	  // 2. 用于保存 ECharts 实例（必须用 useRef 而不是 useState，避免闭包陷阱和不必要的重渲染）
	  const chartInstance = useRef(null);
	  // 初始化图表
	  useEffect(() => {
	    if (!chartRef.current) return;
	    // 初始化实例
	    chartInstance.current = echarts.init(chartRef.current);
	    // 定义配置项
	    const option = {
	      title: {
	        text: title,
	        left: 'center'
	      },
	      tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	          type: 'cross'
	        }
	      },
	      grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '20%', // 底部留白给 dataZoom
	        containLabel: true
	      },
	      xAxis: {
	        type: 'time',
	        splitLine: { show: false }
	      },
	      yAxis: {
	        type: 'value',
	        splitLine: { lineStyle: { type: 'dashed' } }
	      },
	      dataZoom: [
	        {
	          type: 'slider',
	          show: true,
	          xAxisIndex: [0],
	          start: 0,
	          end: 10, // 初始显示 10%
	          bottom: 10
	        },
	        {
	          type: 'inside', // 支持鼠标滚轮缩放
	          xAxisIndex: [0],
	          start: 0,
	          end: 10
	        }
	      ],
	      series: [
	        {
	          name: '监控数据',
	          type: 'line',
	          // 【性能优化核心 1】隐藏拐点，极大提升渲染速度
	          symbol: 'none', 
	          // 【性能优化核心 2】开启大数据模式
	          large: true, 
	          largeThreshold: 2000,
	          lineStyle: {
	            width: 1
	          },
	          data: data
	        }
	      ]
	    };
	    chartInstance.current.setOption(option);
	    // 处理窗口大小变化
	    const handleResize = () => {
	      chartInstance.current?.resize();
	    };
	    window.addEventListener('resize', handleResize);
	    // 销毁逻辑：组件卸载时执行
	    return () => {
	      window.removeEventListener('resize', handleResize);
	      chartInstance.current?.dispose();
	      chartInstance.current = null;
	    };
	  }, []); // 这里依赖项为空，确保实例只初始化一次
	  // 数据更新逻辑（当 props.data 变化时触发）
	  useEffect(() => {
	    if (chartInstance.current && data.length > 0) {
	      chartInstance.current.setOption({
	        series: [{
	          data: data
	        }]
	      });
	    }
	  }, [data]); // 依赖 data
	  return (
	    <div 
	      ref={chartRef} 
	      style={{ width: '100%', height: height }} 
	    />
	  );
	};
	export default LargeLineChart;