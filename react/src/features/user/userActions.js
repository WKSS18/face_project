import { createAsyncThunk } from "@reduxjs/toolkit";

// 模拟异步 API 调用
const mockApiCall = (userId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId === 1) {
                resolve({ id: 1, name: "John Doe", email: "john@example.com" });
            } else {
                reject(new Error("User not found"));
            }
        }, 1000);
    });
};

// 定义异步 Thunk Action
export const fetchUser = createAsyncThunk(
    "user/fetchUser", // Action 类型前缀
    async (userId) => {
        const response = await mockApiCall(userId);
        return response; // 返回的数据会作为 payload 传递给 fulfilled
    }
);
