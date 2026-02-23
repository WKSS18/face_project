	<template>
	  <div>
	    <button @click="loadData" :disabled="isLoading">
	      {{ isLoading ? '加载中...' : '获取用户数据' }}
	    </button>
	    <!-- 错误提示 -->
	    <div v-if="error" style="color: red">{{ error }}</div>
	    <!-- 数据列表 -->
	    <ul v-if="!isLoading && users.length > 0">
	      <li v-for="user in users" :key="user.id">
	        {{ user.name }}
	      </li>
	    </ul>
	    <div v-else-if="!isLoading && users.length === 0">
	      暂无数据
	    </div>
	  </div>
	</template>
	<script setup>
	import { useUserStore } from '@/stores/sync'
	import { storeToRefs } from 'pinia'
import { watch } from 'vue'
	// 实例化 store
	const userStore = useUserStore()
	// 使用 storeToRefs 解构 state 和 getters，保持响应式
	const { users, loading: isLoading, error } = storeToRefs(userStore)
	// actions 可以直接从 store 解构，或者直接通过 userStore 调用
	const { fetchUsers } = userStore


    watch(users,(nd,od) =>{
        console.log(nd,nd.length,nd[0],nd[0].name,'===')
    })
	const loadData = () => {
	  fetchUsers()
	}
	</script>