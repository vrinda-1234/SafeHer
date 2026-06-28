// src/components/Layout.jsx

import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div
          className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24 lg:pb-6"
          style={{
            background:
              "linear-gradient(135deg,#FFF5F8 0%,#FAFAFA 45%,#F5F0FF 100%)",
          }}
        >
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
