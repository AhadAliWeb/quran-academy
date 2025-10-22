import { RouterProvider, createBrowserRouter } from 'react-router'
import { AdminDashboardRoutes, StudentDashboardRoutes, TeacherDashboardRoutes } from './routes/DashboardRoutes.jsx'

import Login from "./pages/Login.jsx"
import Confirmation from './pages/Confirmation.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import './App.css'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import AppLayout from './components/AppLayout.jsx'
import Unauthorized from './pages/UnAuthorized.jsx'
import { useDispatch } from 'react-redux'
import LoadingScreen from './components/LoadingScreen.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { setUserInfo, clearUserInfo } from './slices/userSlice.js';
import axios from 'axios'



function App() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/v1/users/me');
        const { name, email, isApproved, role, id } = res.data.user;


        dispatch(setUserInfo({ name, email, isApproved, role, id }));
      } catch (err) {
        dispatch(clearUserInfo());
      } finally {
        setLoading(false)
      }
    };

    fetchUser();
  }, [dispatch]);


  if(loading) return <LoadingScreen />

  const router = createBrowserRouter([
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/register",
            element: <Register />
          },
          {
            path: "/confirmation",
            element: <Confirmation />
          },
          {
            path: "/unauthorized",
            element: <Unauthorized />
          },
          ...StudentDashboardRoutes,
          ...TeacherDashboardRoutes,
          ...AdminDashboardRoutes
])

  return (
    <>
      <RouterProvider router={router} /> 
    </>
  )
}

export default App
