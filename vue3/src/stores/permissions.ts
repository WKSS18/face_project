import { defineStore } from 'pinia'
import { asyncRoutes } from '@/router'
import { ref } from 'vue'

/**
 * @param roles 用户角色数组 ['admin']
 * @param route 路由对象
 * @returns {boolean} 是否有权限
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 如果路由定义了 roles，则检查用户角色是否包含在内
    // 这里假设只要有一个匹配即可
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 没定义 roles 说明是公共路由，都有权限
    return true
  }
}

/**
 * 过滤异步路由
 * @param routes 待过滤的路由列表
 * @param roles 用户角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // 如果有子路由，递归过滤
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', () => {
  // 实际加载的路由表（用于渲染菜单）
  const routes = ref([])
  
  // 动态添加的路由（只保存动态部分）
  const addRoutes = ref([])

  // 设置路由方法
  function setRoles(roles) {
    let accessedRoutes
    if (roles.includes('admin')) {
      // 如果是 admin，直接加载所有动态路由（示例中为了演示，也可以按需过滤）
      accessedRoutes = asyncRoutes || []
    } else {
      // 其他角色过滤
      console.log('====过滤====',asyncRoutes)
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      console.log(accessedRoutes,'===')
    }
    
    addRoutes.value = accessedRoutes
    routes.value = accessedRoutes
  }

  return { routes, setRoles, addRoutes }
})