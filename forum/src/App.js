import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import {createBrowserRouter, RouterProvider, Route, Outlet} from "react-router-dom"
import Navbar from "./components/navbar/navbar"
import RightBar from "./components/rightBar/rightBar"
import LeftBar from "./components/leftBar/leftBar"
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"

function App() {
  const Layout = ()=>{
    return(
      <>
        <Navbar/>
        <div style={{display:"flex"}}>
        <LeftBar/>
        <Outlet/>
        <RightBar/>
        </div>
      </>
    )
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children: [
        {
          path:"/",
          element: <Home/>
        },
        {
          path:"/profile/:id",
          element: <Profile/>
        }
      ]
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path: "/register",
      element: <Register/>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
