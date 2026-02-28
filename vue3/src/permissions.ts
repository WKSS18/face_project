import router from './router'
import { usePermissionStore } from './stores/permissions'

// 模拟后端获取用户角色接口 (实际项目中这里会调用 api)
const getRolesApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟返回当前用户是 'admin'，或者是 'user'
      // 你可以在这里修改 ['user'] 来测试权限变化
      resolve(['user']) 
    }, 500) // 模拟网络延迟 500ms
  })
}

// 防止重复调用权限接口的标志位
let isLoaded = false

router.beforeEach(async (to, from, next) => {
  const permissionStore = usePermissionStore()

  // 1. 判断是否已经获取过权限
  if (isLoaded) {
    next() // 已获取，直接放行
  } else {
    try {
      // 2. 模拟异步请求后端权限
      // 在这里我们不校验 Token，直接模拟获取
      const roles = await getRolesApi()
      console.log('获取到的用户权限:', roles)

      // 3. 根据 roles 过滤出可访问的路由
      permissionStore.setRoles(roles)
      
      const accessRoutes = permissionStore.addRoutes
      console.log('动态生成的路由:', accessRoutes)

      // 4. 动态挂载路由到 router 上
      accessRoutes.forEach(route => {
        router.addRoute(route)
      })

      // 5. 标记已完成
      isLoaded = true

      // 6. 确保路由添加完成 (hack 方法)
      // replace: true 确保本次导航不会留下历史记录，重新进入路由守卫
      next({ ...to, replace: true })

    } catch (error) {
      console.error('获取权限失败', error)
      // 这里通常跳登录页，但需求说不用考虑登录，我们可以放行或者 alert
      next() 
    }
  }
})