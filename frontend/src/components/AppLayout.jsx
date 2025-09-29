// AppLayout.jsx
import { Outlet } from "react-router";
import useCheckUser from "../utils/useCheckUser";

function AppLayout() {
  useCheckUser(); // ✅ runs inside <RouterProvider>
  return <Outlet />;
}

export default AppLayout;