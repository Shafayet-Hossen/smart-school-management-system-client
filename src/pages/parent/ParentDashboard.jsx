import { useEffect, useMemo, useState } from "react";
import api from "../../services/api.js";

const ParentDashboard = () => {
    const [childAttendance, setChildAttendance] =
        useState(null);
    const [academicOverview, setAcademicOverview] =
        useState(null);
    const [detailsLoading, setDetailsLoading] =
        useState(false);

    const [children, setChildren] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [selectedChildId, setSelectedChildId] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [assignments, setAssignments] =
        useState([]);
    const [assignmentLoading, setAssignmentLoading] =
        useState(false);


    useEffect(() => {
        loadDashboard();
    }, []);

    // useEffect(() => {
    //     if (selectedChildId) {
    //         loadChildDetails(selectedChildId);
    //     }
    // }, [selectedChildId]);
    // setSelectedChildId(
    //     childrenData[0].student_id
    // );

    useEffect(() => {
        if (!selectedChildId) {
            return;
        }

        loadChildDetails(selectedChildId);

        loadChildAssignments(
            selectedChildId
        );
    }, [selectedChildId]);

    const loadChildAssignments = async (
        student_id
    ) => {
        try {
            setAssignmentLoading(true);

            const response = await api.get(
                `/parent-dashboard/children/${student_id}/assignments`
            );

            setAssignments(
                response.data.data?.assignments || []
            );

        } catch (error) {

            console.error(
                "Assignment loading error:",
                error
            );

            setAssignments([]);

        } finally {
            setAssignmentLoading(false);
        }
    };

    const loadChildDetails = async (student_id) => {
        try {
            setDetailsLoading(true);
            setError("");

            const [
                attendanceResponse,
                academicResponse
            ] = await Promise.all([
                api.get(
                    `/parent-dashboard/children/${student_id}/attendance`
                ),

                api.get(
                    `/parent-dashboard/children/${student_id}/academic`
                )
            ]);

            setChildAttendance(
                attendanceResponse.data.data
            );

            setAcademicOverview(
                academicResponse.data.data
            );

        } catch (error) {
            console.error(
                "Child details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load child details"
            );

        } finally {
            setDetailsLoading(false);
        }
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                childrenResponse,
                attendanceResponse
            ] = await Promise.all([
                api.get("/parents/me/children"),
                api.get("/parent-dashboard/attendance")
            ]);

            const childrenData =
                childrenResponse.data.data || [];

            const attendanceData =
                attendanceResponse.data.data || [];

            setChildren(childrenData);
            setAttendance(attendanceData);

            // Automatically select first child
            if (childrenData.length > 0) {
                setSelectedChildId(
                    childrenData[0].student_id
                );
            }

        } catch (error) {
            console.error(
                "Parent dashboard error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load parent dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    const selectedChild = useMemo(() => {
        return children.find(
            (child) =>
                child.student_id === selectedChildId
        );
    }, [children, selectedChildId]);

    const assignmentStats = useMemo(() => {

        const stats = {
            total: assignments.length,
            pending: 0,
            submitted: 0,
            graded: 0,
            overdue: 0
        };

        assignments.forEach(
            (assignment) => {

                if (
                    assignment.status ===
                    "pending"
                ) {
                    stats.pending++;
                }

                if (
                    assignment.status ===
                    "submitted"
                ) {
                    stats.submitted++;
                }

                if (
                    assignment.status ===
                    "graded"
                ) {
                    stats.graded++;
                }

                if (
                    assignment.status ===
                    "overdue"
                ) {
                    stats.overdue++;
                }
            }
        );

        return stats;

    }, [assignments]);

    // const selectedChildAttendance = useMemo(() => {
    //     return attendance.filter(
    //         (item) =>
    //             item._id?.student_id === selectedChildId
    //     );
    // }, [attendance, selectedChildId]);

    // const attendanceStats = useMemo(() => {
    //     let present = 0;
    //     let absent = 0;
    //     let late = 0;

    //     selectedChildAttendance.forEach((item) => {
    //         const status = item._id?.status;
    //         const count = Number(item.count || 0);

    //         if (status === "present") {
    //             present += count;
    //         }

    //         if (status === "absent") {
    //             absent += count;
    //         }

    //         if (status === "late") {
    //             late += count;
    //         }
    //     });

    //     const total =
    //         present + absent + late;

    //     const percentage =
    //         total > 0
    //             ? (present / total) * 100
    //             : 0;

    //     return {
    //         present,
    //         absent,
    //         late,
    //         total,
    //         percentage
    //     };
    // }, [selectedChildAttendance]);

    const attendanceStats =
        childAttendance || {
            present: 0,
            absent: 0,
            late: 0,
            total: 0,
            attendance_percentage: 0,
            records: []
        };

    const academicPercentage =
        Number(
            academicOverview?.average_percentage || 0
        );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    if (children.length === 0) {
        return (
            <div className="p-6">
                <div className="alert alert-info">
                    <span>
                        No children are currently linked to your parent account.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    Parent Dashboard
                </h1>

                <p className="text-base-content/60 mt-1">
                    Monitor your children's academic progress
                </p>
            </div>

            {/* Child Selector */}
            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Select Child
                    </h2>

                    <select
                        className="select select-bordered w-full"
                        value={selectedChildId}
                        onChange={(event) =>
                            setSelectedChildId(
                                event.target.value
                            )
                        }
                    >

                        {children.map((child) => (
                            <option
                                key={child.student_id}
                                value={child.student_id}
                            >
                                {child.name} — {child.student_id}
                            </option>
                        ))}

                    </select>

                </div>

            </div>

            {/* Selected Child */}
            {selectedChild && (
                <div className="card bg-base-100 shadow">

                    <div className="card-body">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {selectedChild.name}
                                </h2>

                                <p className="text-base-content/60">
                                    Student ID:{" "}
                                    {selectedChild.student_id}
                                </p>

                                <p className="text-base-content/60">
                                    Class:{" "}
                                    {selectedChild.class_id}
                                </p>

                            </div>

                            <div className="badge badge-primary badge-lg">
                                {selectedChild.status || "Active"}
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* Attendance */}
            <div>

                <div className="mb-4">

                    <h2 className="text-2xl font-bold">
                        Attendance
                    </h2>

                    <p className="text-base-content/60">
                        Attendance summary for{" "}
                        {selectedChild?.name}
                    </p>

                </div>

                {/* Attendance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Attendance Percentage */}
                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Attendance
                        </div>

                        <div className="stat-value text-primary">
                            {attendanceStats.percentage}%
                        </div>

                        <div className="stat-desc">
                            Overall attendance
                        </div>

                    </div>

                    {/* Present */}
                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Present
                        </div>

                        <div className="stat-value text-success">
                            {attendanceStats.present}
                        </div>

                        <div className="stat-desc">
                            Days present
                        </div>

                    </div>

                    {/* Absent */}
                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Absent
                        </div>

                        <div className="stat-value text-error">
                            {attendanceStats.absent}
                        </div>

                        <div className="stat-desc">
                            Days absent
                        </div>

                    </div>

                    {/* Late */}
                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Late
                        </div>

                        <div className="stat-value text-warning">
                            {attendanceStats.late}
                        </div>

                        <div className="stat-desc">
                            Late arrivals
                        </div>

                    </div>

                </div>

            </div>

            {/* Attendance Progress */}
            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <div className="flex justify-between items-center mb-2">

                        <h2 className="card-title">
                            Attendance Progress
                        </h2>

                        <span className="font-bold">
                            {attendanceStats.percentage}%
                        </span>

                    </div>

                    <progress
                        className="progress progress-primary w-full"
                        value={attendanceStats.percentage}
                        max="100"
                    />

                    <div className="mt-4">

                        {attendanceStats.percentage >= 90 && (
                            <div className="alert alert-success">
                                <span>
                                    Excellent attendance.
                                </span>
                            </div>
                        )}

                        {attendanceStats.percentage >= 75 &&
                            attendanceStats.percentage < 90 && (
                                <div className="alert alert-info">
                                    <span>
                                        Good attendance. Keep it up.
                                    </span>
                                </div>
                            )}

                        {attendanceStats.percentage >= 60 &&
                            attendanceStats.percentage < 75 && (
                                <div className="alert alert-warning">
                                    <span>
                                        Attendance needs improvement.
                                    </span>
                                </div>
                            )}

                        {attendanceStats.percentage < 60 && (
                            <div className="alert alert-error">
                                <span>
                                    Attendance is critically low.
                                </span>
                            </div>
                        )}

                    </div>

                </div>

            </div>

            {/* Refresh */}
            <div className="flex justify-end">

                <button
                    className="btn btn-outline"
                    onClick={loadDashboard}
                >
                    Refresh Dashboard
                </button>

            </div>

            {/* Attendance Details Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Attendance
                    </div>

                    <div className="stat-value text-primary">
                        {Number(
                            attendanceStats.attendance_percentage || 0
                        )
                            // .toFixed(2)
                        }%
                    </div>

                    <div className="stat-desc">
                        Overall attendance
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Present
                    </div>

                    <div className="stat-value text-success">
                        {attendanceStats.present || 0}
                    </div>

                    <div className="stat-desc">
                        Days present
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Absent
                    </div>

                    <div className="stat-value text-error">
                        {attendanceStats.absent || 0}
                    </div>

                    <div className="stat-desc">
                        Days absent
                    </div>
                </div>


                <div className="stat bg-base-100 shadow rounded-box">
                    <div className="stat-title">
                        Late
                    </div>

                    <div className="stat-value text-warning">
                        {attendanceStats.late || 0}
                    </div>

                    <div className="stat-desc">
                        Late arrivals
                    </div>
                </div>

            </div>

            {/* Academic Overview card */}
            <div>

                <div className="mb-4">

                    <h2 className="text-2xl font-bold">
                        Academic Overview
                    </h2>

                    <p className="text-base-content/60">
                        Academic performance of{" "}
                        {selectedChild?.name}
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Exams
                        </div>

                        <div className="stat-value">
                            {academicOverview?.total_exams || 0}
                        </div>

                        <div className="stat-desc">
                            Recorded assessments
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Average
                        </div>

                        <div className="stat-value text-primary">
                            {Number(
                                academicOverview?.average_percentage || 0
                            )
                                // .toFixed(2)
                            }%
                        </div>

                        <div className="stat-desc">
                            Overall performance
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Total Marks
                        </div>

                        <div className="stat-value">
                            {academicOverview?.total_obtained || 0}
                        </div>

                        <div className="stat-desc">
                            Marks obtained
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Total Possible
                        </div>

                        <div className="stat-value">
                            {academicOverview?.total_marks || 0}
                        </div>

                        <div className="stat-desc">
                            Maximum marks
                        </div>

                    </div>

                </div>

            </div>

            {/* Recent Result */}
            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Recent Results
                    </h2>

                    <p className="text-base-content/60 mb-4">
                        Latest examination results
                    </p>

                    <div className="overflow-x-auto">

                        <table className="table table-zebra">

                            <thead>
                                <tr>
                                    <th>Exam</th>
                                    <th>Subject</th>
                                    <th>Obtained</th>
                                    <th>Total</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>

                            <tbody>

                                {(academicOverview?.recent_results || [])
                                    .map((result, index) => {

                                        const obtained =
                                            Number(
                                                result.obtained_marks || 0
                                            );

                                        const total =
                                            Number(
                                                result.total_marks || 0
                                            );

                                        const percentage =
                                            total > 0
                                                ? (obtained / total) * 100
                                                : 0;

                                        return (
                                            <tr
                                                key={
                                                    result._id || index
                                                }
                                            >

                                                <td>
                                                    {result.exam_name ||
                                                        result.exam_id ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {result.subject_name ||
                                                        result.subject_id ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {obtained}
                                                </td>

                                                <td>
                                                    {total}
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            percentage >= 80
                                                                ? "badge badge-success"
                                                                : percentage >= 60
                                                                    ? "badge badge-warning"
                                                                    : "badge badge-error"
                                                        }
                                                    >
                                                        {percentage
                                                            // .toFixed(2)
                                                        }%
                                                    </span>

                                                </td>

                                            </tr>
                                        );
                                    })}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* Academic Performance Message */}
            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Academic Status
                    </h2>

                    {academicPercentage >= 80 && (
                        <div className="alert alert-success">
                            <span>
                                Excellent academic performance.
                            </span>
                        </div>
                    )}

                    {academicPercentage >= 60 &&
                        academicPercentage < 80 && (
                            <div className="alert alert-info">
                                <span>
                                    Good academic performance.
                                </span>
                            </div>
                        )}

                    {academicPercentage >= 40 &&
                        academicPercentage < 60 && (
                            <div className="alert alert-warning">
                                <span>
                                    Academic performance needs improvement.
                                </span>
                            </div>
                        )}

                    {academicPercentage < 40 && (
                        <div className="alert alert-error">
                            <span>
                                Academic performance requires immediate attention.
                            </span>
                        </div>
                    )}

                </div>

            </div>

            {/* Assignment Summary Card */}
            <div>

                <div className="mb-4">

                    <h2 className="text-2xl font-bold">
                        Assignments
                    </h2>

                    <p className="text-base-content/60">
                        Assignment status for{" "}
                        {selectedChild?.name}
                    </p>

                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Total
                        </div>

                        <div className="stat-value">
                            {assignmentStats.total}
                        </div>

                        <div className="stat-desc">
                            Assignments
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Pending
                        </div>

                        <div className="stat-value text-warning">
                            {assignmentStats.pending}
                        </div>

                        <div className="stat-desc">
                            Not submitted
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Submitted
                        </div>

                        <div className="stat-value text-info">
                            {assignmentStats.submitted}
                        </div>

                        <div className="stat-desc">
                            Awaiting grading
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Graded
                        </div>

                        <div className="stat-value text-success">
                            {assignmentStats.graded}
                        </div>

                        <div className="stat-desc">
                            Completed
                        </div>

                    </div>


                    <div className="stat bg-base-100 shadow rounded-box">

                        <div className="stat-title">
                            Overdue
                        </div>

                        <div className="stat-value text-error">
                            {assignmentStats.overdue}
                        </div>

                        <div className="stat-desc">
                            Past due date
                        </div>

                    </div>

                </div>

            </div>

            {/* Assignment Details Table */}
            <div className="card bg-base-100 shadow">

                <div className="card-body">

                    <h2 className="card-title">
                        Assignment Details
                    </h2>

                    <p className="text-base-content/60 mb-4">
                        Recent assignments and submission status
                    </p>

                    {assignmentLoading ? (

                        <div className="flex justify-center py-10">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>

                    ) : assignments.length === 0 ? (

                        <div className="alert alert-info">
                            <span>
                                No assignments found for this child.
                            </span>
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="table table-zebra">

                                <thead>

                                    <tr>
                                        <th>Assignment</th>
                                        <th>Subject</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Marks</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {assignments.map(
                                        (assignment) => (

                                            <tr
                                                key={
                                                    assignment.assignment_id
                                                }
                                            >

                                                <td>

                                                    <div className="font-semibold">
                                                        {assignment.title}
                                                    </div>

                                                    {assignment.description && (
                                                        <div className="text-xs text-base-content/60">
                                                            {assignment.description}
                                                        </div>
                                                    )}

                                                </td>


                                                <td>
                                                    {assignment.subject_name ||
                                                        assignment.subject_id ||
                                                        "-"}
                                                </td>


                                                <td>
                                                    {assignment.due_date
                                                        ? new Date(
                                                            assignment.due_date
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </td>


                                                <td>

                                                    {assignment.status ===
                                                        "pending" && (
                                                            <span className="badge badge-warning">
                                                                Pending
                                                            </span>
                                                        )}

                                                    {assignment.status ===
                                                        "submitted" && (
                                                            <span className="badge badge-info">
                                                                Submitted
                                                            </span>
                                                        )}

                                                    {assignment.status ===
                                                        "graded" && (
                                                            <span className="badge badge-success">
                                                                Graded
                                                            </span>
                                                        )}

                                                    {assignment.status ===
                                                        "overdue" && (
                                                            <span className="badge badge-error">
                                                                Overdue
                                                            </span>
                                                        )}

                                                </td>


                                                <td>

                                                    {assignment.submission?.marks ??
                                                        "-"}

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            

        </div>
    );
};

export default ParentDashboard;