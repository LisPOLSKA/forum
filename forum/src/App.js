import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import {createBrowserRouter, RouterProvider, Route, Outlet, Navigate} from "react-router-dom"
import Navbar from "./components/navbar/navbar"
import RightBar from "./components/rightBar/rightBar"
import LeftBar from "./components/leftBar/leftBar"
import Home from "./pages/home/Home"
import Profile from "./pages/profile/Profile"
import "./style.scss"
import { useContext } from "react"
import { DarkModeContext } from "./context/darkModeContext"
import { AuthContext } from "./context/authContext"

function App() {
  
  const currentUser = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);

  const Layout = ()=>{
    return(
      <>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar/>
          <div style={{display:"flex"}}>
            <LeftBar/>
            <div style={{flex:6}}>
              <Outlet/>
            </div>
            <RightBar/>
          </div>
        </div>
      </>
    )
  }

  const ProtectedRoute = ({children}) => {
    if(!currentUser){
      return <Navigate to="/login"/>
    }

    return children
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout/>
        </ProtectedRoute>
      ),
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
