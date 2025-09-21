import { useSelector } from "react-redux";
import { Routing } from "./Components/Routings.jsx";

// A placeholder for your main app/home page
export default function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <>
    <Routing />
    </>
  );
}
