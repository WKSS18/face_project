import { Navigate } from 'react-router-dom';
import JsCom from '@/pages/JsCom';
import ReduxCom from '@/pages/ReduxCom';
import MoreReport from '@/pages/MoreReport'
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
    }
];
export default routes;