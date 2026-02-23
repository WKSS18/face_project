	<template>
	  <div>
	    <h2>递归树组件示例</h2>
	    <!-- 根节点调用 -->
	    <TreeItem 
	      :menu="treeData" 
	      @select="onSelect"
	    />
	  </div>
	</template>
	<script setup>
	// 【修正点】显式导入 ref
	import { ref } from 'vue'
	import TreeItem from './Children.vue'
	// 模拟树形数据
	const treeData = ref({
	  id: 1,
	  title: '一级菜单 1',
	  children: [
	    {
	      id: 2,
	      title: '二级菜单 1-1',
	      children: [
	        { id: 3, title: '三级菜单 1-1-1' },
	        { id: 4, title: '三级菜单 1-1-2' }
	      ]
	    },
	    {
	      id: 5,
	      title: '二级菜单 1-2'
	    }
	  ]
	})
	const onSelect = (node) => {
	  console.log('选中节点：', node.title)
	}
	</script>