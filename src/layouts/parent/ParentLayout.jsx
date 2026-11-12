import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import ParentNavbar from "../../components/parent/ParentNavbar.jsx";
import ParentSidebar from "../../components/parent/ParentSidebar.jsx";

import { getParentChildren } from "../../services/parentExamService.js";

const ParentLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState("");

    // Fetch parent's linked children
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["parent-children"],
        queryFn: getParentChildren,
    });

    const children = data?.children ?? data?.data?.children ?? [];
    // console.log("Parent's linked children:", children);

    // Automatically select the first child when no child is selected
    const selectedChild =
        children.find(
            (child) =>
                String(child._id) === String(selectedChildId)
        ) || children[0] || null;

    const activeChildId = selectedChild
        ? String(selectedChild._id)
        : "";

    return (
        <div className="min-h-screen bg-base-200/50">

            <ParentSidebar
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
                <ParentNavbar
                    setMobileOpen={setMobileOpen}
                    children={children}
                    selectedChild={selectedChild}
                    selectedChildId={activeChildId}
                    setSelectedChildId={setSelectedChildId}
                />

                <main className="min-h-[calc(100vh-76px)] p-4 md:p-6">
                    <div className="mx-auto w-full max-w-[1800px]">

                        <Outlet
                            context={{
                                children,
                                selectedChild,
                                selectedChildId: activeChildId,
                                setSelectedChildId,
                                isChildrenLoading: isLoading,
                                isChildrenError: isError,
                            }}
                        />

                    </div>
                </main>

                <footer className="border-t border-base-200 bg-base-100 px-6 py-4 text-center text-xs text-base-content/50">
                    © {new Date().getFullYear()} Smart School. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ParentLayout;


// import { useState } from "react";
// import { Outlet } from "react-router-dom";

// import ParentNavbar from "../../components/parent/ParentNavbar";
// import ParentSidebar from "../../components/parent/ParentSidebar";

// const ParentLayout = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const [mobileOpen, setMobileOpen] = useState(false);

//     return (
//         <div className="min-h-screen bg-base-200/50">
//             <ParentSidebar
//                 collapsed={collapsed}
//                 setCollapsed={setCollapsed}
//                 mobileOpen={mobileOpen}
//                 setMobileOpen={setMobileOpen}
//             />

//             <div
//                 className={`min-h-screen transition-all duration-300 ${
//                     collapsed ? "lg:ml-[82px]" : "lg:ml-[270px]"
//                 }`}
//             >
//                 <ParentNavbar setMobileOpen={setMobileOpen} />

//                 <main className="min-h-[calc(100vh-76px)] p-4 md:p-6">
//                     <div className="mx-auto w-full max-w-[1800px]">
//                         <Outlet />
//                     </div>
//                 </main>

//                 <footer className="border-t border-base-200 bg-base-100 px-6 py-4 text-center text-xs text-base-content/50">
//                     © {new Date().getFullYear()} Smart School. All rights reserved.
//                 </footer>
//             </div>
//         </div>
//     );
// };

// export default ParentLayout;