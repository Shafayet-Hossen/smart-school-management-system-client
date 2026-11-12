import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Menu,
    Search,
    Bell,
    ChevronDown,
    UserRound,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
    "/teacher/dashboard": "Dashboard",
    "/teacher/students": "Students",
    "/teacher/teachers": "Teachers",
    "/teacher/classes": "Classes",
    "/teacher/sections": "Sections",
    "/teacher/subjects": "Subjects",
    "/teacher/attendance": "Attendance",
    "/teacher/examinations": "Examinations",
    "/teacher/fees": "Fee Management",
    "/teacher/reports": "Reports",
    "/teacher/settings": "Settings",
};

const TeacherNavbar = ({ setMobileOpen }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, } = useAuth();

    const currentTitle =
        pageTitles[location.pathname] || "School Teacher";

    const handleLogout = async () => {

        try {

            await logout();

            setProfileOpen(false);
            navigate(
                "/login",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


    return (
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-base-200 bg-base-100/95 px-4 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="btn btn-ghost btn-square btn-sm lg:hidden"
                    aria-label="Open navigation"
                >
                    <Menu size={21} />
                </button>

                <div>
                    <h1 className="text-lg font-bold">
                        {currentTitle}
                    </h1>
                    <p className="hidden text-xs text-base-content/50 sm:block">
                        Welcome to your school management workspace
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <label className="hidden items-center gap-2 rounded-xl border border-base-300 px-3 py-2 md:flex">
                    <Search size={17} className="text-base-content/40" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-36 bg-transparent text-sm outline-none lg:w-48"
                    />
                    <kbd className="kbd kbd-xs">⌘ K</kbd>
                </label>

                <button
                    className="btn btn-ghost btn-circle btn-sm relative"
                    aria-label="Notifications"
                    onClick={() => navigate("/teacher/notifications")}
                >
                    <Bell size={20} />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-error" />
                </button>

                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-base-200"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserRound size={20} />
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold">
                                School Teacher
                            </p>
                            <p className="text-[11px] text-base-content/50">
                                Teacher
                            </p>
                        </div>

                        <ChevronDown
                            size={15}
                            className="hidden text-base-content/50 sm:block"
                        />
                    </button>

                    {profileOpen && (
                        <>
                            <button
                                aria-label="Close profile menu"
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setProfileOpen(false)}
                            />

                            <div className="absolute right-0 top-14 z-50 w-52 rounded-xl border border-base-200 bg-base-100 p-2 shadow-xl">
                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/teacher/profile");
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
                                >
                                    <UserRound size={17} />
                                    My Profile
                                </button>

                                <button
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/teacher/settings");
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
                                >
                                    <Settings size={17} />
                                    Settings
                                </button>

                                <div className="my-1 border-t border-base-200" />

                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error hover:bg-error/10"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TeacherNavbar;