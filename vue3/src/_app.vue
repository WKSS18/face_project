<script setup>
import { storeToRefs } from 'pinia' // 【重点】引入 storeToRefs
import { usePermissionStore } from './stores/permissions'
import { onMounted } from 'vue'
 
const permissionStore = usePermissionStore()
 
// 【关键修改】使用 storeToRefs 保持响应式
const { routes } = storeToRefs(permissionStore)
 
// 调试：打印一下当前路由，看看有没有数据
console.log('当前App加载的路由列表:', routes.value)
 
</script>
 
<template>
  <header>
    <div class="wrapper">
      <!-- 简单的调试按钮，如果没有显示菜单，点这个看看控制台 -->
      <!-- <button @click="console.log(routes)">查看 Store Routes</button> -->
 
      <nav class="dynamic-nav">
        <!-- 这里的 routes 现在绝对是响应式的 -->
        <RouterLink
          v-for="route in routes"
          :key="route.path"
          :to="route.path"
        >
          <!-- 使用 meta.title，如果没有则用 route.name -->
          {{ route.meta?.title || route.name }}
        </RouterLink>
      </nav>
    </div>
  </header>
 
  <RouterView />
</template>
	<style scoped>
	/* 添加一些简单的样式，让菜单更好看 */
	header {
	  line-height: 1.5;
	  max-height: 100vh;
	}
	.logo {
	  display: block;
	  margin: 0 auto 2rem;
	}
	nav.dynamic-nav {
	  width: 100%;
	  font-size: 12px;
	  text-align: center;
	  margin-top: 2rem;
	  display: flex;
	  justify-content: center;
	  gap: 20px;
	}
	.dynamic-nav a.router-link-exact-active {
	  color: var(--color-text);
	  font-weight: bold;
	}
	.dynamic-nav a {
	  color: #2c3e50;
	  text-decoration: none;
	  padding: 5px 10px;
	  border: 1px solid #eee;
	  border-radius: 4px;
	}
	.dynamic-nav a:hover {
	  background-color: #f5f5f5;
	}
	</style>