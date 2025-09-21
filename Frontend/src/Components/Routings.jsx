import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Header from "./Header";
import Home from "../pages/Home";
import PostPage from "../pages/Postpage";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

export const Routing = () => {
    const user = useSelector(state => state.auth.user);
    return(
  <BrowserRouter>
  <ToastContainer/>
    <Header />
    <Routes>
      <Route path="/" element={user ?  <Home /> : <SignIn />} />
      <Route path="/leaderboard" element={user ? <Leaderboard /> : <SignIn />} />
      <Route path="/post/:id" element={user ? <PostPage /> : <SignIn />} />
      <Route path="/create" element={user ? <CreatePost /> : <SignIn />} />
      <Route path="/profile/:id" element={user ? <Profile /> : <SignIn />} />
      <Route path="/signup" element={!user ? <SignUp /> : <Home />} />
      <Route path="/signin" element={!user ? <SignIn /> : <Home />} />
      {/* <Route path="/profile" element={} />
      <Route path="/logout" element={} /> */}
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  </BrowserRouter>
);
}
export default Routing;