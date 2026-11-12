import { Outlet } from "react-router-dom";
import FeeManagementSidebar from "./FeeManagementSidebar";

const FeeManagementLayout = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 pt-2 pr-2">

            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 lg:shrink-0">
                <FeeManagementSidebar />
            </aside>

            {/* Right Content */}
            <main className="flex-1 min-w-0">
                <Outlet />
            </main>

        </div>
    );
};

export default FeeManagementLayout;