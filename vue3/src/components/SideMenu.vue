	<template>
	  <el-menu
	    :default-active="activeMenu"
	    class="el-menu-vertical-demo"
	    :router="true"
	    background-color="#545c64"
	    text-color="#fff"
	    active-text-color="#ffd04b"
	  >
	    <template v-for="item in menuList" :key="item.path">
	      <!-- 情况1：存在子菜单 -->
	      <el-sub-menu 
	        v-if="item.children && item.children.length > 0 && !item.meta?.hidden" 
	        :index="resolvePath(item.path)" 
	      >
	        <template #title>
	          <span>{{ item.meta?.title || item.name }}</span>
	        </template>
	        <!-- 递归调用：必须把当前路径作为父路径传下去 -->
	        <side-menu 
	          :menu-list="item.children" 
	          :parent-path="resolvePath(item.path)" 
	        />
	      </el-sub-menu>
	      <!-- 情况2：普通菜单项 -->
	      <el-menu-item 
	        v-else-if="!item.meta?.hidden" 
	        :index="resolvePath(item.path)" 
	      >
	        <template #title>{{ item.meta?.title || item.name }}</template>
	      </el-menu-item>
	    </template>
	  </el-menu>
	</template>
	<script setup lang="ts">
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	interface Props {
	  menuList: any[]
	  parentPath?: string // 新增：接收父级路径
	}
	defineOptions({ name: 'SideMenu' })
	const props = withDefaults(defineProps<Props>(), {
	  parentPath: ''
	})
	const route = useRoute()
	const activeMenu = computed(() => route.path)
	// 【核心逻辑】计算完整路径
	const resolvePath = (routePath: string) => {
	  // 如果 path 已经是绝对路径（以 / 开头），直接返回
	  if (routePath.startsWith('/')) {
	    return routePath
	  }
	  // 否则拼接父级路径
	  return `${props.parentPath}/${routePath}`
	}
	</script>
	<style scoped>
	.el-menu-vertical-demo {
	  height: 100vh;
	}
	</style>