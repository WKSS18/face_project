import React from 'react';
import { FixedSizeList as List } from 'react-window';

// 1. 模拟 10 万条数据
const itemCount = 100000;
const itemSize = 35; // 每行高度
const listHeight = 600; // 容器高度

// 2. 单行渲染组件
// 注意：react-window 的 children 是一个函数，或者使用 component 形式
const Row = ({ index, style }) => (
    <div style={style} className={index % 2 ? 'list-item-odd' : 'list-item-even'}>
        Row {index} - 这是第 {index} 条数据
    </div>
);

const VirtualListWithReactWindow = () => {
    return (
        <div className="list-container">
            <h3>React-Window 实现 (10万条数据)</h3>
            <List
                height={listHeight}
                itemCount={itemCount}
                itemSize={itemSize}
                width={'100%'}
            >
                {Row}
            </List>
        </div>
    );
};

export default VirtualListWithReactWindow;