import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from 'antd'
import { fetchUser } from "../../features/user/userActions";
import { decrement, increment } from '../../features/count/countSlice'
function App() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.user);
    const count = useSelector((state) => state.counter.value)

    return (
        <div>
            <h1>Redux Toolkit 异步示例</h1>
            <Button onClick={() => dispatch(fetchUser(1))}>异步点击</Button>
            <Button onClick={() => dispatch(increment())}>同步点击</Button>
            {loading && <p>加载中...</p>}
            {error && <p style={{ color: "red" }}>错误: {error}</p>}
            {data && (
                <div>
                    <h2>用户信息</h2>
                    <p>ID: {data.id}</p>
                    <p>姓名: {data.name}</p>
                    <p>邮箱: {data.email}</p>
                </div>
            )}
            {
                <div>同步点击<p>{count}</p></div>
            }
        </div>
    );
}

export default App;
