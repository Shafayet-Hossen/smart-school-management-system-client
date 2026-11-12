import { useQuery } from "@tanstack/react-query";
import { getTeacherClasses } from "../../../services/teacherClassService.js";
import { useNavigate } from "react-router-dom";

const MyClasses = () => {
    const navigate = useNavigate();
    const {
        data: classes = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["teacher-classes"],
        queryFn: getTeacherClasses,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                <span>
                    {error?.response?.data?.message ||
                        "Failed to load your classes."}
                </span>
            </div>
        );
    }

    const handleBack = () => {

        navigate("/dashboard");

    };

    return (
        <div className="p-6">
            <div>
                <button
                    onClick={handleBack}
                    className="text-sm font-medium text-base-content/50 hover:text-primary hover:cursor-pointer"
                >
                    ← Dashboard
                </button>

            </div>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    My Classes
                </h1>

                <p className="text-base-content/70 mt-1">
                    View the classes and sections assigned to you.
                </p>
            </div>

            {/* No Classes */}
            {classes.length === 0 ? (
                <div className="card bg-base-100 shadow">
                    <div className="card-body items-center text-center">
                        <div className="text-5xl mb-3">
                            🏫
                        </div>

                        <h2 className="card-title">
                            No Classes Assigned
                        </h2>

                        <p className="text-base-content/70">
                            You have not been assigned to any class or
                            section yet.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {classes.map((classItem) => (
                        <div
                            key={classItem._id}
                            className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="card-body">

                                {/* Class Name */}
                                <h2 className="card-title text-xl">
                                    {classItem.name}
                                </h2>

                                {/* Description */}
                                {classItem.description && (
                                    <p className="text-sm text-base-content/70">
                                        {classItem.description}
                                    </p>
                                )}

                                {/* Sections */}
                                <div className="mt-4">

                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold">
                                            Assigned Sections
                                        </h3>

                                        <span className="badge badge-primary">
                                            {classItem.sections?.length || 0}
                                        </span>
                                    </div>

                                    <div className="space-y-2">

                                        {classItem.sections?.map((section) => (
                                            <div
                                                key={section._id}
                                                className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {section.name}
                                                    </p>

                                                    {section.description && (
                                                        <p className="text-xs text-base-content/60">
                                                            {section.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <span className="badge badge-success">
                                                    Assigned
                                                </span>
                                            </div>
                                        ))}

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default MyClasses;