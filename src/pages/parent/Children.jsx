
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import api from "../../services/api.js";

const fetchChildren = async () => {
    const response = await api.get("/parent/children");

    if (response.data?.success === false) {
        throw new Error(
            response.data.message || "Failed to load children."
        );
    }

    // Supports common API response structures.
    const children =
        response.data?.children ??
        response.data?.data?.children ??
        response.data?.data ??
        [];

    if (!Array.isArray(children)) {
        throw new Error(
            "Invalid children data received from the server."
        );
    }

    return children;
};

const getChildName = (child) => {
    if (child.student_name) {
        return child.student_name;
    }

    if (child.name) {
        return child.name;
    }

    const fullName = [
        child.first_name,
        child.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .trim();

    return fullName || "Student";
};

const getInitials = (name) => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
};

const getStatusStyle = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "active":
        case "approved":
            return "badge-success";

        case "pending":
            return "badge-warning";

        case "rejected":
        case "inactive":
            return "badge-error";

        default:
            return "badge-ghost";
    }
};

const ChildCard = ({ child }) => {
    const name = getChildName(child);

    const rollNumber =
        child.student_roll ??
        child.roll_number ??
        child.student?.roll_number ??
        "Not available";

    const className =
        child.class_name ??
        child.student?.class_name ??
        "Not assigned";

    const sectionName =
        child.section_name ??
        child.student?.section_name ??
        "Not assigned";

    const status =
        child.student_status ??
        child.status ??
        child.student?.status ??
        "Active";

    return (
        <article className="card border border-base-300 bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="card-body gap-4 p-5">
                {/* Student header */}
                <div className="flex items-start gap-4">
                    <div className="avatar placeholder">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-content">
                            <span className="text-lg font-bold">
                                {getInitials(name) || "S"}
                            </span>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold">
                            {name}
                        </h2>

                        <p className="mt-1 text-sm text-base-content/60">
                            Roll: {rollNumber}
                        </p>
                    </div>

                    <div
                        className={`badge ${getStatusStyle(status)} badge-outline shrink-0`}
                    >
                        {status}
                    </div>
                </div>

                <div className="divider my-0" />

                {/* Academic information */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-base-200/70 p-3">
                        <p className="text-xs text-base-content/60">
                            Class
                        </p>

                        <p className="mt-1 break-words font-semibold">
                            {className}
                        </p>
                    </div>

                    <div className="rounded-xl bg-base-200/70 p-3">
                        <p className="text-xs text-base-content/60">
                            Section
                        </p>

                        <p className="mt-1 break-words font-semibold">
                            {sectionName}
                        </p>
                    </div>
                </div>

                {child.school_name && (
                    <div>
                        <p className="text-xs text-base-content/60">
                            School
                        </p>

                        <p className="mt-1 break-words text-sm font-medium">
                            {child.school_name}
                        </p>
                    </div>
                )}

                {child.student_id && (
                    <div>
                        <p className="text-xs text-base-content/60">
                            Student ID
                        </p>

                        <p className="mt-1 break-all text-sm font-medium">
                            {child.student_id}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
};

const Children = () => {
    const {
        data: children = [],
        isPending,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["parent", "children"],
        queryFn: fetchChildren,
        staleTime: 60 * 1000,
        retry: 1,
    });

    const sortedChildren = useMemo(() => {
        return [...children].sort((a, b) =>
            getChildName(a).localeCompare(getChildName(b))
        );
    }, [children]);

    return (
        <main className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page heading */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">👨‍👩‍👧‍👦</span>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                My Children
                            </h1>
                        </div>

                        <p className="mt-2 text-sm text-base-content/60 sm:text-base">
                            View your children's academic information
                            and school enrollment details.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-outline btn-primary"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        <span
                            className={
                                isFetching
                                    ? "loading loading-spinner loading-sm"
                                    : ""
                            }
                        />

                        {isFetching ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                {/* Children count */}
                {!isPending && !isError && (
                    <section className="stats w-full border border-base-300 bg-base-100 shadow-sm">
                        <div className="stat">
                            <div className="stat-title">
                                Total Children
                            </div>

                            <div className="stat-value text-primary">
                                {children.length}
                            </div>

                            <div className="stat-desc">
                                Linked to your parent account
                            </div>
                        </div>
                    </section>
                )}

                {/* Loading state */}
                {isPending && (
                    <section
                        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
                        aria-label="Loading children"
                    >
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="card border border-base-300 bg-base-100"
                            >
                                <div className="card-body gap-5">
                                    <div className="flex items-center gap-4">
                                        <div className="skeleton h-14 w-14 shrink-0 rounded-2xl" />

                                        <div className="flex-1 space-y-2">
                                            <div className="skeleton h-4 w-3/4" />
                                            <div className="skeleton h-3 w-1/2" />
                                        </div>
                                    </div>

                                    <div className="skeleton h-20 w-full" />
                                    <div className="skeleton h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Error state */}
                {isError && (
                    <section className="alert alert-error items-start">
                        <div className="flex-1">
                            <h2 className="font-bold">
                                Unable to load children
                            </h2>

                            <p className="mt-1 text-sm">
                                {error?.response?.data?.message ||
                                    error?.message ||
                                    "Something went wrong. Please try again."}
                            </p>

                            <button
                                type="button"
                                className="btn btn-sm mt-3"
                                onClick={() => refetch()}
                                disabled={isFetching}
                            >
                                Try Again
                            </button>
                        </div>
                    </section>
                )}

                {/* Empty state */}
                {!isPending &&
                    !isError &&
                    sortedChildren.length === 0 && (
                        <section className="rounded-2xl border border-dashed border-base-300 bg-base-100 px-5 py-14 text-center">
                            <div className="mb-4 text-5xl">
                                🎒
                            </div>

                            <h2 className="text-xl font-bold">
                                No Children Found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
                                No children are currently linked to your
                                parent account. If you have submitted a
                                connection request, please check with
                                your school administrator.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary mt-5"
                                onClick={() => refetch()}
                            >
                                Check Again
                            </button>
                        </section>
                    )}

                {/* Children cards */}
                {!isPending &&
                    !isError &&
                    sortedChildren.length > 0 && (
                        <section>
                            <div className="mb-4">
                                <h2 className="text-lg font-bold">
                                    Children Overview
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    {sortedChildren.length}{" "}
                                    {sortedChildren.length === 1
                                        ? "student"
                                        : "students"}{" "}
                                    found
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {sortedChildren.map((child, index) => (
                                    <ChildCard
                                        key={
                                            child.student_id ??
                                            child._id ??
                                            `${child.student_roll}-${child.section_id}-${index}`
                                        }
                                        child={child}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
            </div>
        </main>
    );
};

export default Children;
