import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import RightBar from "./components/rightBar/rightBar";
import LeftBar from "./components/leftBar/leftBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import "./style.scss";
import { DarkModeContext } from "./context/darkModeContext";
import { useAuth } from "./context/AuthContext"; // Użycie useAuth
import { QueryClient, QueryClientProvider } from "react-query";
import Friends from "./pages/friends/Friends";
import Logout from "./pages/Logout/Logout";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const queryClient = new QueryClient();
  const { currentUser } = useAuth(); // Używamy currentUser

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!currentUser; // Booleanowe sprawdzenie autoryzacji

    if (!isAuthenticated) {
      return <Navigate to="/login" />; // Przekierowanie, jeśli nie zalogowany
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />, // Główna strona po zalogowaniu
        },
        {
          path: "/friends",
          element: <Friends />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Register />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
