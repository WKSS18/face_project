	<template>
	  <div class="tree-item">
	    <!-- 当前节点内容 -->
	    <div class="node-content" @click="handleClick">
	      <span>{{ menu.title }}</span>
	      <span v-if="hasChildren" class="arrow">[展开]</span>
	    </div>
	    <!-- 递归渲染子节点 -->
	    <div v-if="hasChildren" class="children-container">
	      <TreeItem
	        v-for="child in menu.children"
	        :key="child.id"
	        :menu="child"
	        @select="handleChildSelect"
	      />
	    </div>
	  </div>
	</template>
	<script setup>
	// 【修正点】必须显式导入 computed
	import { computed } from 'vue'
	// 定义组件名称，用于递归引用
	defineOptions({
	  name: 'TreeItem'
	})
	// 定义 Props
	const props = defineProps({
	  menu: {
	    type: Object,
	    required: true,
	    default: () => ({})
	  }
	})
	// 定义 Emits
	const emit = defineEmits(['select'])
	// 计算属性：判断是否有子节点
	// computed 需要从 vue 导入
	const hasChildren = computed(() => {
	  return props.menu.children && props.menu.children.length > 0
	})
	// 处理点击
	const handleClick = () => {
	  emit('select', props.menu)
	}
	// 处理子组件冒泡事件
	const handleChildSelect = (data) => {
	  emit('select', data)
	}
	</script>
	<style scoped>
	.tree-item {
	  margin-left: 20px;
	  border-left: 1px dashed #ccc;
	}
	.node-content {
	  padding: 5px 10px;
	  cursor: pointer;
	}
	.node-content:hover {
	  background-color: #f0f0f0;
	}
	</style>