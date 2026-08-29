import {
    Navigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext.jsx";

import SchoolAdminDashboard
    from "./SchoolAdminDashboard.jsx";

import TeacherDashboard
    from "./TeacherDashboard.jsx";

import StudentDashboard
    from "./StudentDashboard.jsx";

import ParentDashboard
    from "./ParentDashboard.jsx";


function Dashboard() {

    const {
        user,
        loading,
    } = useAuth();

    console.log("user:",user)

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div className="flex min-h-screen items-center justify-center bg-base-200">

                <span className="loading loading-spinner loading-lg text-primary" />

            </div>
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Not authenticated
    |--------------------------------------------------------------------------
    */

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Role
    |--------------------------------------------------------------------------
    */

    const role =
        user.role;


    /*
    |--------------------------------------------------------------------------
    | School Admin
    |--------------------------------------------------------------------------
    */

    if (role === "school_admin") {

        return (
            <SchoolAdminDashboard
                user={user}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Teacher
    |--------------------------------------------------------------------------
    */

    if (role === "teacher") {

        return (
            <TeacherDashboard
                user={user}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Student
    |--------------------------------------------------------------------------
    */

    if (role === "student") {

        return (
            <StudentDashboard
                user={user}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Parent
    |--------------------------------------------------------------------------
    */

    if (role === "parent") {

        return (
            <ParentDashboard
                user={user}
            />
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Unknown role
    |--------------------------------------------------------------------------
    */

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 px-4">

            <div className="max-w-md rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow">

                <div className="text-4xl">
                    ⚠️
                </div>

                <h1 className="mt-4 text-xl font-bold">
                    Invalid Account Role
                </h1>

                <p className="mt-2 text-sm text-base-content/60">
                    Your account does not have a valid
                    Smart School role.
                </p>

            </div>

        </div>
    );

}

export default Dashboard;