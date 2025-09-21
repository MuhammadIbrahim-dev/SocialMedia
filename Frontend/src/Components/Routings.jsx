import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Header from "./Header";
import Home from "../pages/Home";
import { useSelector } from "react-redux";

export const Routing = () => {
    const user = useSelector(state => state.auth.user);
    return(
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={user ?  <Home /> : <SignIn />} />
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