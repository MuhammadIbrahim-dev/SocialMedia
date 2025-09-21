import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './src/redux/AuthSlice/Auth.Slice.jsx'
import PostsReducer from './src/redux/PostSlice.jsx'
import UsersReducer from './src/redux/UserSlice.jsx'
import CommentsReducer from './src/redux/CommentSlice.jsx'
import LeaderboardReducer from './src/redux/leaderboard.jsx'

export const Store = configureStore({
    reducer:{
        auth : AuthReducer,
        posts: PostsReducer,
        users: UsersReducer,
        comments: CommentsReducer,
        leaderboard: LeaderboardReducer,
    }
})