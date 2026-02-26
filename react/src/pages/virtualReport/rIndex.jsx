import React from 'react';
import { List, AutoSizer } from 'react-virtualized'; // 引入 AutoSizer
import 'react-virtualized/styles.css';
const rowCount = 100000;
const rowHeight = 40;
const listHeight = 600;
const rowRenderer = ({ index, key, style }) => {
  return (
    <div key={key} style={style}>
      <div style={{ background: index % 2 ? '#f0f0f0' : '#fff', height: '100%', lineHeight: '40px', paddingLeft: '10px' }}>
        Row {index} - react-virtualized 渲染
      </div>
    </div>
  );
};
const VirtualListWithReactVirtualized = () => {
  return (
    <div style={{ height: listHeight, width: '100%' }}> {/* 父容器必须有明确宽高 */}
      <h3>React-Virtualized 实现 (10万条数据)</h3>
      {/* 使用 AutoSizer 自动填充父容器宽高 */}
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}       // AutoSizer 提供的数值宽度
            height={height}     // AutoSizer 提供的数值高度
            rowCount={rowCount}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
          />
        )}
      </AutoSizer>
    </div>
  );
};
export default VirtualListWithReactVirtualized;