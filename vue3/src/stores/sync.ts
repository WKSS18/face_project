	// stores/userStore.js
	import { defineStore } from 'pinia'
	// import axios from 'axios' // 假设使用 axios 发送请求
	export const useUserStore = defineStore('user', {
	  state: () => ({
	    users: [],
	    loading: false,
	    error: null
	  }),
	  getters: {
	    // 获取用户总数
	    userCount: (state) => state.users.length
	  },
	  actions: {
	    // 定义异步 Action
	    async fetchUsers() {
	      this.loading = true
	      this.error = null
	      try {
	        // 模拟 API 请求
	        // const response = await axios.get('https://api.example.com/users')
	        // 这里使用 setTimeout 模拟异步请求
	        await new Promise(resolve => setTimeout(resolve, 1000))
	        // 假设请求成功返回的数据
	        const mockData = [
	          { id: 1, name: 'Alice' },
	          { id: 2, name: 'Bob' }
	        ]
	        this.users = mockData
	      } catch (err) {
	        this.error = err.message || '获取数据失败'
	      } finally {
	        this.loading = false
	      }
	    }
	  }
	})