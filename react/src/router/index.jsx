import { Navigate } from 'react-router-dom';
import JsCom from '@/pages/JsCom';
import ReduxCom from '@/pages/ReduxCom';
import MoreReport from '@/pages/MoreReport'
import Fetch from '@/pages/fetch'
import List from '@/pages/VirtualList'
const routes = [
    {
        path: '/',
        element: <JsCom />,
        meta: { title: 'JS' } // 自定义字段
    },
    {
        path: '/redux',
        element: <ReduxCom />,
        meta: { title: 'Redux' }
    },
    {
        path: '/report',
        element: <MoreReport />,
        meta: { title: '报表' }
    },
    {
        path:'/fetch',
        element:<Fetch/>,
        meta:{title:'swr'}
    },
    {
        path:'/list',
        element:<List/>,
        meta:{title:'list'}

    }
];
export default routes;