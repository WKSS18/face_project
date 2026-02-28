// // src/App.jsx
// import store from './store/index';
// import { Provider } from 'react-redux';
// import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
// import { Layout, Menu } from 'antd';
// import routes from './router';
// import { useMemo } from 'react';
// const { Sider, Content } = Layout;
// // --- 路由视图组件 ---
// function RouterView() {
//   const element = useRoutes(routes);
//   return element;
// }
// // --- 菜单组件 ---
// function SideMenu() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // 1. 将路由配置转换为 Menu 组件需要的 items 格式
//   // 过滤掉 meta.hideMenu 为 true 的路由，并映射数据结构
//   const menuItems = useMemo(() => {
//     return routes
//       .filter(route => route.meta && !route.meta.hideMenu)
//       .map(route => ({
//         key: route.path, // key 必须是 path，用于高亮匹配
//         icon: route.meta?.icon,
//         label: route.meta?.title,
//       }));
//   }, []);
//   // 2. 点击菜单项时的跳转逻辑
//   const handleMenuClick = ({ key }) => {
//     navigate(key);
//   };
//   return (
//     <Sider width={200} style={{ background: '#001529' }}>
//       <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
//       <Menu
//         theme="dark"
//         mode="inline"
//         selectedKeys={[location.pathname]} // 关键点：根据当前 URL 高亮
//         items={menuItems}
//         onClick={handleMenuClick}
//       />
//     </Sider>
//   );
// }
// // --- 主应用结构 ---
// function App() {
//   return (
//     <Provider store={store}>
//       <Layout style={{ width: '100vw', minHeight: '100vh' }}>
//         <SideMenu />
//         <Layout style={{ width: '100%', background: '#ccc' }}>
//           <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
//             {/* 路由渲染区域 */}
//             <RouterView />
//           </Content>
//         </Layout>
//       </Layout>
//     </Provider>
//   );
// }
// export default App;


import store from './store/index';
import { Provider } from 'react-redux';
import { useRoutes, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd'; // 引入 Spin 组件
import routes from './router';
import { useMemo, useState, useEffect } from 'react';
const { Sider, Content } = Layout;
// --- 模拟 API 请求 ---
// 模拟后端接口：返回用户拥有权限的路径列表
const fetchUserPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 假设后端返回用户只能看到 '首页' 和 '系统设置'
      // 如果想模拟不同权限，可以修改这个数组，例如：['/home', '/user']
      const permissionPaths = ['/redux', '/report', '/'];
      resolve(permissionPaths);
    }, 1000); // 模拟 1秒 网络延迟
  });
};
// --- 路由视图组件 ---
function RouterView({ routes }) {
  const element = useRoutes(routes);
  return element;
}
// --- 菜单组件 ---
function SideMenu({ menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const handleMenuClick = ({ key }) => {
    navigate(key);
  };
  return (
    <Sider width={200} style={{ background: '#001529' }}>
      <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}
// --- 主应用结构 ---
function App() {
  const [loading, setLoading] = useState(true); // 初始化加载状态
  const [allowedRoutes, setAllowedRoutes] = useState([]); // 存储过滤后的路由
  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. 请求权限数据
        const permissions = await fetchUserPermissions();
        // 2. 根据权限过滤路由
        // 逻辑：路由配置中 meta.hideMenu 为 true 的不展示在菜单，但也可能需要可访问
        // 这里演示：只展示在后端返回的权限列表中的路由
        const filteredRoutes = routes.filter(route => {
          // 基础路由（如重定向）可能没有 meta，这里假设都要权限控制
          // 如果 route.meta 不存在，通常需要特殊处理，这里简单判断
          if (!route.path) return false;
          return permissions.includes(route.path);
        });
        setAllowedRoutes(filteredRoutes);
      } catch (error) {
        console.error('权限获取失败', error);
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);
  // 计算 Menu 组件需要的 items 格式
  const menuItems = useMemo(() => {
    return allowedRoutes
      .filter(route => route.meta && !route.meta.hideMenu)
      .map(route => ({
        key: route.path,
        icon: route.meta?.icon,
        label: route.meta?.title,
      }));
  }, [allowedRoutes]);
  // 全屏加载状态
  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Spin size="large" tip="正在加载菜单权限..." />
      </div>
    );
  }
  return (
    <Provider store={store}>
      <Layout style={{ width: '100vw', minHeight: '100vh' }}>
        {/* 将过滤后的菜单项传给 SideMenu */}
        <SideMenu menuItems={menuItems} />
        <Layout style={{ flex: 1, background: '#f0f2f5' }}>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              flex: 1, // 撑满剩余高度
              overflow: 'auto' // 内容溢出处理
            }}
          >
            {/* 关键点：将过滤后的路由传给 useRoutes */}
            <RouterView routes={allowedRoutes} />
          </Content>
        </Layout>
      </Layout>
    </Provider>
  );
}
export default App;