// import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: HomeView,
//     },
//     {
//       path: '/about',
//       name: 'about',
//       // route level code-splitting
//       // this generates a separate chunk (About.[hash].js) for this route
//       // which is lazy-loaded when the route is visited.
//       component: () => import('../views/AboutView.vue'),
//     },
//     {
//       path:'/level',
//       name:'level',
//       component:() =>import('../views/pages/digui/Parent.vue')
//     },
//     {
//       path:'/pinia',
//       name:'pinia',
//       component:() =>import('../views/pages/pinia/Index.vue')
//     }
//   ],
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// 1. 常量路由：所有人可见
export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'about页面'
    }
  },
]

// 2. 动态路由：根据权限动态挂载
export const asyncRoutes = [
  {
    path: '/level',
    name: 'level',
    component: () => import('../views/pages/digui/Parent.vue'),
    meta: {
      title: '递归页面',
      roles: ['user'] // 只有 admin 能进
    }
  },
  {
    path: '/pinia',
    name: 'pinia',
    component: () => import('../views/pages/pinia/Index.vue'),
    meta: {
      title: 'Pinia页面',
      roles: ['user']   // 只有 user 能进 (假设 admin 也能进，需要在逻辑里写 OR)
    }
  },
  {
    path: '/test',
    name: 'test',
    // 【关键1】父路由必须指定一个组件，该组件内部必须包含 <router-view />
    component: () => import('../views/pages/test/Parent.vue'),
    // 【优化】点击父级菜单时，默认重定向到第一个子菜单
    redirect: '/test/list',
    meta: {
      title: '测试',
      roles: ['user']
    },
    children: [
      {
        // 子路由路径，最终访问路径为 /test/list
        path: 'list',
        name: 'testList',
        component: () => import('../views/pages/test/List.vue'),
        meta: {
          title: '测试列表',
          roles: ['user']
        }
      },
      {
        // 子路由路径，最终访问路径为 /test/detail
        path: 'detail',
        name: 'testDetail',
        component: () => import('../views/pages/test/Detail.vue'),
        meta: {
          title: '测试详情',
          roles: ['user']
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes // 初始化只加载常量路由
})

export default router