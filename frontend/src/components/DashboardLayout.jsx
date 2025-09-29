
import { useState, useEffect } from 'react';
import { Menu, X, Home, Users, Settings, BarChart3, Bell, User } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router';
import { adminLinks, studentLinks, teacherLinks} from '../utils/links';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserInfo } from '../slices/userSlice';


const DashboardLayout = ({name}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [navLinks, setNavLinks] = useState([])

  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    
    if(!user.email) {
      axios
      .get("/api/v1/users/me")
      .then((res) => {
        const { name, email, isApproved, role, id } = res.data.user;

        dispatch(setUserInfo({ name, email, isApproved, role, id }));


        if (!isApproved) {
          navigate("/confirmation");
        }

      })
      .catch((err) => {
        console.log(err);
        navigate("/login")
      });
    }
    else {
      if(!user.isApproved) navigate('/confirmation') 
    }

  }, []);


  const setLinks = () => {

    if(name === "Admin") setNavLinks(adminLinks)
    
    if(name === "Teacher") setNavLinks(teacherLinks)

    if(name === "Student") setNavLinks(studentLinks)

  }
  

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    setLinks()
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg h-screen transition-all duration-300 ease-in-out z-50 ${
          isMobile 
            ? `fixed inset-y-0 left-0 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${sidebarOpen ? 'w-[15%] min-w-[200px]' : 'w-0 overflow-hidden'}`
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">Dashboard</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 ${isMobile ? 'block' : 'hidden'}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors duration-200 group"
              > 
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-primary" />
                <span className="whitespace-nowrap">{item.text}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center cursor-pointer">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;