import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getParentChildren } from "../../services/parentExamService.js";

const ParentExamLayout = () => {
    const [selectedChildId, setSelectedChildId] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["parent-exam-children"],
        queryFn: getParentChildren,
    });

    const children = Array.isArray(data?.children)
        ? data.children
        : [];

    const selectedChild =
        children.find(
            (child) =>
                String(child._id) === String(selectedChildId)
        ) || children[0] || null;

    const activeChildId = selectedChild
        ? String(selectedChild._id)
        : "";

    const navClass = ({ isActive }) =>
        `btn btn-sm ${
            isActive
                ? "btn-primary"
                : "btn-ghost"
        }`;

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-error">
                {error?.message || "Unable to load your children."}
            </div>
        );
    }

    if (!children.length) {
        return (
            <div className="alert alert-warning">
                No linked children were found in your account.
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">
                    Exam Management
                </h1>

                <p className="text-sm text-base-content/60">
                    View your child's examination information.
                </p>
            </div>

            {/* Child Selector */}
            <div className="card bg-base-100 shadow-sm">
                <div className="card-body">

                    <label className="label">
                        <span className="label-text font-semibold">
                            Select Child
                        </span>
                    </label>

                    <select
                        className="select select-bordered w-full max-w-md"
                        value={activeChildId}
                        onChange={(event) =>
                            setSelectedChildId(event.target.value)
                        }
                    >
                        {children.map((child) => (
                            <option
                                key={child._id}
                                value={String(child._id)}
                            >
                                {child.first_name} {child.last_name}
                                {child.student_id
                                    ? ` (${child.student_id})`
                                    : ""}
                            </option>
                        ))}
                    </select>

                    {selectedChild && (
                        <div className="mt-3 text-sm text-base-content/70">
                            <p>
                                Class: {selectedChild.class_name || "—"}
                            </p>
                            <p>
                                Section: {selectedChild.section_name || "—"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-wrap gap-2">
                <NavLink
                    to="/parent/exams"
                    end
                    className={navClass}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/parent/exams/schedule"
                    className={navClass}
                >
                    Exam Schedule
                </NavLink>

                <NavLink
                    to="/parent/exams/upcoming"
                    className={navClass}
                >
                    Upcoming
                </NavLink>

                <NavLink
                    to="/parent/exams/completed"
                    className={navClass}
                >
                    Completed
                </NavLink>
            </div>

            {/* Nested Pages */}
            <Outlet
                context={{
                    selectedChild,
                    selectedChildId: activeChildId,
                }}
            />

        </div>
    );
};

export default ParentExamLayout;