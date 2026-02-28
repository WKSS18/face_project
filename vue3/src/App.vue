<!-- <script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/level">Level</RouterLink>
        <RouterLink to="/pinia">pinia</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style> -->






  	<script setup>
	import { storeToRefs } from 'pinia'
	import { usePermissionStore } from './stores/permissions'
	import SideMenu from './components/SideMenu.vue' // 引入刚才的菜单组件
	const permissionStore = usePermissionStore()
	// 保持响应式
	const { routes } = storeToRefs(permissionStore)
	</script>
	<template>
	  <!-- 使用 Element Plus 布局容器 -->
	  <el-container class="layout-container">
	    <el-aside width="200px">
	      <!-- 使用我们的递归菜单组件 -->
	      <side-menu :menu-list="routes" />
	    </el-aside>
	    <el-container>
	      <el-header>Header 区域</el-header>
	      <el-main>
	        <!-- 路由视图 -->
	        <RouterView />
	      </el-main>
	    </el-container>
	  </el-container>
	</template>
	<style scoped>
	.layout-container {
	  height: 100vh;
    width: 100vw;
	}
	.el-header {
	  background-color: #b3c0d1;
	  color: #333;
	  line-height: 60px;
	  display: flex;
	  align-items: center;
	}
	.el-aside {
	  background-color: #545c64;
	  color: #fff;
	  overflow-x: hidden; /* 防止菜单折叠时出现滚动条 */
	}
	.el-main {
	  background-color: #e9eef3;
	  color: #333;
	}
	</style>