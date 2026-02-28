import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import countReducer from '../features/count/countSlice'
const rootReducer = combineReducers({
    user: userReducer,
    counter: countReducer
});

export default rootReducer;
