import { RouterProvider, createBrowserRouter } from 'react-router'
import { AdminDashboardRoutes, StudentDashboardRoutes, TeacherDashboardRoutes } from './routes/DashboardRoutes.jsx'

import Login from "./pages/Login.jsx"
import Confirmation from './pages/Confirmation.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import './App.css'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import AppLayout from './components/AppLayout.jsx'

function App() {

  const router = createBrowserRouter([
          {
            path: "/",
            element: <Home />
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
