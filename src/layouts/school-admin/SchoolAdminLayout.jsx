import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/school-admin/AdminSidebar";
import AdminNavbar from "../../components/school-admin/AdminNavbar";

const SchoolAdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-base-200/50">
            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div
                className={`min-h-screen transition-all duration-300 ${
                    collapsed ? "lg:ml-[82px]" : "lg:ml-[270px]"
                }`}
            >
                <AdminNavbar setMobileOpen={setMobileOpen} />

                <main className="min-h-[calc(100vh-76px)] p-4 md:p-6">
                    <div className="mx-auto w-full max-w-[1800px]">
                        <Outlet />
                    </div>
                </main>

                <footer className="border-t border-base-200 bg-base-100 px-6 py-4 text-center text-xs text-base-content/50">
                    © {new Date().getFullYear()} Smart School. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default SchoolAdminLayout;