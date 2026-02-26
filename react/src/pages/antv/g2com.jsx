// // organize-imports-ignore
// import React from 'react';
// import { SheetComponent } from '@antv/s2-react';
// import { Pagination } from 'antd';
// import '@antv/s2-react/dist/s2-react.min.css';

// const s2Options = {
//   width: 600,
//   height: 480,
//   pagination: {
//     current: 1,
//     pageSize: 4,
//   },
// };

// function App({ dataCfg }) {
//   return (
//     <>
//       <SheetComponent dataCfg={dataCfg} options={s2Options}>
//         {({ pagination }) => (
//           // 结合任意分页器使用: 如 antd 的 Pagination 组件
//           <Pagination
//             size="small"
//             defaultCurrent={1}
//             showSizeChanger
//             showQuickJumper
//             showTotal={(total) => `共计 ${total} 条`}
//             {...pagination}
//           />
//         )}
//       </SheetComponent>
//     </>
//   );
// }

// fetch(
//   'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
// )
//   .then((res) => res.json())
//   .then((dataCfg) => {
//     reactDOMClient
//       .createRoot(document.getElementById('container'))
//       .render(<App dataCfg={dataCfg} />);
//   });

//   export default App;

import React from 'react';
// 引入 S2 的 React 组件
import { SheetComponent } from '@antv/s2-react';
// 引入样式文件（关键步骤）
import '@antv/s2-react/dist/s2-react.min.css';
const SimpleS2 = () => {
  // 1. 准备数据
  const data = [
    { province: '浙江', city: '杭州', price: 100, amount: 10 },
    { province: '浙江', city: '宁波', price: 200, amount: 20 },
    { province: '江苏', city: '南京', price: 150, amount: 15 },
    { province: '江苏', city: '苏州', price: 180, amount: 18 },
  ];
  // 2. 配置字段
  const dataCfg = {
    fields: {
      rows: ['province', 'city'], // 行头
      values: ['price', 'amount'], // 数值
    },
    meta: [
      { field: 'province', name: '省份' },
      { field: 'city', name: '城市' },
      { field: 'price', name: '价格' },
      { field: 'amount', name: '数量' },
    ],
    data: data,
  };
  // 3. 配置选项
  const options = {
    width: 600,
    height: 400,
    showSeriesNumber: true, // 显示序号列
  };
  return (
    <div>
      <h3>S2 透视表示例</h3>
      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        sheetType="pivot" // pivot: 透视表, table: 明细表
      />
    </div>
  );
};
export default SimpleS2;