import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


function DashboardHeader({ user }) {

    const {
        logout,
    } = useAuth();

    const navigate =
        useNavigate();


    const handleLogout = async () => {

        try {

            await logout();

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

        <header className="sticky top-0 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">

            <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

                <div>

                    <p className="text-sm font-semibold">
                        Smart School
                    </p>

                    <p className="text-xs text-base-content/50">
                        Dashboard
                    </p>

                </div>


                <div className="flex items-center gap-4">

                    <div className="hidden text-right sm:block">

                        <p className="text-sm font-semibold">
                            {user?.first_name}{" "}
                            {user?.last_name}
                        </p>

                        <p className="text-xs text-base-content/50">
                            {user?.role}
                        </p>

                    </div>


                    <div className="dropdown dropdown-end">

                        <button
                            tabIndex={0}
                            className="btn btn-circle btn-ghost"
                        >
                            👤
                        </button>


                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
                        >

                            <li>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/profile"
                                        )
                                    }
                                >
                                    Profile
                                </button>

                            </li>

                            <li>

                                <button
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </header>

    );

}


export default DashboardHeader;